import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'
import useAuthStore from '../store/authStore'

export default function Queue() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  const [reclassify, setReclassify] = useState(null) // { record, level, reason }

  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['queue'],
    queryFn: () => api.get('/triage').then((r) => r.data),
    refetchInterval: 10000,
  })

  const reclassifyMutation = useMutation({
    mutationFn: ({ id, level, reason }) =>
      api.patch(`/triage/${id}/reclassify`, { triage_level: level, reason }),
    onSuccess: () => {
      qc.invalidateQueries(['queue'])
      qc.invalidateQueries(['dashboard'])
      setReclassify(null)
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/triage/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries(['queue'])
      qc.invalidateQueries(['dashboard'])
    },
  })

  if (isLoading) return <p className="text-gray-500">Cargando cola...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Cola de prioridad</h2>
        {(user?.role === 'nurse' || user?.role === 'admin') && (
          <Link to="/triage/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            + Nuevo triage
          </Link>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
          No hay pacientes en espera
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Paciente</th>
                <th className="px-4 py-3">Nivel</th>
                <th className="px-4 py-3">Síntomas</th>
                <th className="px-4 py-3">Llegó</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((r, i) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.patient?.name}</td>
                  <td className="px-4 py-3"><TriageBadge level={r.triage_level} /></td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.symptoms}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.arrived_at).toLocaleTimeString()}</td>
                  <td className="px-4 py-3 flex gap-2 flex-wrap">
                    <Link to={`/triage/${r.id}`} className="text-blue-600 hover:underline text-xs">Ver</Link>
                    {(user?.role === 'nurse' || user?.role === 'admin') && (
                      <button
                        onClick={() => setReclassify({ id: r.id, level: r.triage_level, reason: '' })}
                        className="text-orange-500 hover:underline text-xs"
                      >
                        Reclasificar
                      </button>
                    )}
                    {(user?.role === 'doctor' || user?.role === 'admin') && (
                      <button
                        onClick={() => statusMutation.mutate({ id: r.id, status: 'in_attention' })}
                        className="text-green-600 hover:underline text-xs"
                      >
                        Atender
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal reclasificación */}
      {reclassify && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="font-bold text-lg">Reclasificar paciente</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Nuevo nivel (1=crítico, 5=leve)</label>
              <select
                value={reclassify.level}
                onChange={(e) => setReclassify({ ...reclassify, level: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>Nivel {l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Motivo</label>
              <textarea
                value={reclassify.reason}
                onChange={(e) => setReclassify({ ...reclassify, reason: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReclassify(null)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
              <button
                onClick={() => reclassifyMutation.mutate(reclassify)}
                disabled={!reclassify.reason}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
