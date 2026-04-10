import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'
import useAuthStore from '../store/authStore'

const LEVEL_LABELS = { 1: 'N1 - Crítico', 2: 'N2 - Urgente', 3: 'N3 - Moderado', 4: 'N4 - Leve', 5: 'N5 - No urgente' }

export default function Queue() {
  const user = useAuthStore((s) => s.user)
  const qc = useQueryClient()
  const [reclassify, setReclassify] = useState(null)
  const [filterLevel, setFilterLevel] = useState('todos')
  const [search, setSearch] = useState('')

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

  const canTriage = ['admin', 'nurse', 'doctor'].includes(user?.role)
  const canAttend = ['admin', 'doctor'].includes(user?.role)

  const filtered = useMemo(() => queue.filter((r) => {
    const matchLevel = filterLevel === 'todos' || r.triage_level === Number(filterLevel)
    const matchSearch = !search || r.patient?.name?.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  }), [queue, filterLevel, search])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cola de prioridad</h2>
          <p className="text-sm text-gray-400 mt-0.5">Ordenada por nivel de urgencia + tiempo de espera</p>
        </div>
        {canTriage && (
          <Link
            to="/triage/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
          >
            <span className="text-lg leading-none">+</span> Nuevo triage
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />
        <div className="flex gap-2 flex-wrap">
          {['todos', '1', '2', '3', '4', '5'].map((l) => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filterLevel === l
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {l === 'todos' ? 'Todos' : LEVEL_LABELS[l]}
              {l !== 'todos' && <span className="ml-1 opacity-70">({queue.filter(r => r.triage_level === Number(l)).length})</span>}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando cola...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-gray-500 font-medium">No hay pacientes en espera</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left font-medium">#</th>
                <th className="px-5 py-3 text-left font-medium">Paciente</th>
                <th className="px-5 py-3 text-left font-medium">Nivel</th>
                <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Síntomas</th>
                <th className="px-5 py-3 text-left font-medium">Llegó</th>
                <th className="px-5 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{r.patient?.name}</td>
                  <td className="px-5 py-4"><TriageBadge level={r.triage_level} /></td>
                  <td className="px-5 py-4 text-gray-400 max-w-xs truncate hidden md:table-cell">{r.symptoms}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(r.arrived_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/triage/${r.id}`} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Ver</Link>
                      {canTriage && (
                        <button
                          onClick={() => setReclassify({ id: r.id, level: r.triage_level, reason: '' })}
                          className="text-amber-500 hover:text-amber-700 text-xs font-medium"
                        >
                          Reclasificar
                        </button>
                      )}
                      {canAttend && (
                        <button
                          onClick={() => statusMutation.mutate({ id: r.id, status: 'in_attention' })}
                          className="text-emerald-500 hover:text-emerald-700 text-xs font-medium"
                        >
                          Atender
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reclassify && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Reclasificar paciente</h3>
              <p className="text-sm text-gray-400 mt-0.5">El cambio quedará registrado en el historial</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nuevo nivel</label>
              <select
                value={reclassify.level}
                onChange={(e) => setReclassify({ ...reclassify, level: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Nivel 1 — Rojo (Crítico)</option>
                <option value={2}>Nivel 2 — Naranja (Urgente)</option>
                <option value={3}>Nivel 3 — Amarillo (Moderado)</option>
                <option value={4}>Nivel 4 — Verde (Leve)</option>
                <option value={5}>Nivel 5 — Azul (No urgente)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Motivo</label>
              <textarea
                value={reclassify.reason}
                onChange={(e) => setReclassify({ ...reclassify, reason: e.target.value })}
                placeholder="Describe el cambio en el estado del paciente..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setReclassify(null)} className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium">
                Cancelar
              </button>
              <button
                onClick={() => reclassifyMutation.mutate(reclassify)}
                disabled={!reclassify.reason || reclassifyMutation.isPending}
                className="flex-1 px-4 py-2.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition font-medium disabled:opacity-50"
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
