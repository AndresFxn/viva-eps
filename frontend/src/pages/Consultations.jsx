import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

export default function Consultations() {
  const qc = useQueryClient()
  const [finish, setFinish] = useState(null)
  const [newConsult, setNewConsult] = useState(null)

  const { data: consultations, isLoading } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => api.get('/consultations').then((r) => r.data.data || []),
  })

  const { data: queue = [] } = useQuery({
    queryKey: ['queue'],
    queryFn: () => api.get('/triage').then((r) => r.data),
  })

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms').then((r) => r.data),
  })

  const { data: doctors = [] } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => api.get('/me').then(() => []), // placeholder, usamos rooms con doctor
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/consultations', data),
    onSuccess: () => { qc.invalidateQueries(['consultations']); qc.invalidateQueries(['dashboard']); setNewConsult(null) },
  })

  const finishMutation = useMutation({
    mutationFn: ({ id, diagnosis, treatment }) => api.patch(`/consultations/${id}/finish`, { diagnosis, treatment }),
    onSuccess: () => { qc.invalidateQueries(['consultations']); qc.invalidateQueries(['dashboard']); setFinish(null) },
  })

  if (isLoading) return <p className="text-gray-500">Cargando consultas...</p>

  const availableRooms = rooms.filter((r) => r.is_available)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Consultas</h2>
        <button onClick={() => setNewConsult({ triage_record_id: '', doctor_id: '', room_id: '' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Asignar consulta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Sala</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(consultations || []).map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.triage_record?.patient?.name}</td>
                <td className="px-4 py-3"><TriageBadge level={c.triage_record?.triage_level} /></td>
                <td className="px-4 py-3">{c.doctor?.name}</td>
                <td className="px-4 py-3">{c.room?.name}</td>
                <td className="px-4 py-3 text-gray-400">{new Date(c.started_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.ended_at ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {c.ended_at ? 'Finalizada' : 'En curso'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!c.ended_at && (
                    <button onClick={() => setFinish({ id: c.id, diagnosis: '', treatment: '' })}
                      className="text-green-600 hover:underline text-xs">
                      Finalizar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!consultations || consultations.length === 0) && (
          <p className="text-center text-gray-400 py-8">No hay consultas registradas</p>
        )}
      </div>

      {/* Modal nueva consulta */}
      {newConsult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="font-bold text-lg">Asignar consulta</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Paciente en espera</label>
              <select value={newConsult.triage_record_id}
                onChange={(e) => setNewConsult({ ...newConsult, triage_record_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Seleccionar...</option>
                {queue.map((r) => (
                  <option key={r.id} value={r.id}>{r.patient?.name} — Nivel {r.triage_level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sala disponible</label>
              <select value={newConsult.room_id}
                onChange={(e) => {
                  const room = availableRooms.find((r) => r.id === Number(e.target.value))
                  setNewConsult({ ...newConsult, room_id: e.target.value, doctor_id: room?.assigned_doctor_id || '' })
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Seleccionar...</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} — {r.doctor?.name || 'Sin doctor'}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setNewConsult(null)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
              <button
                onClick={() => createMutation.mutate(newConsult)}
                disabled={!newConsult.triage_record_id || !newConsult.room_id || !newConsult.doctor_id}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal finalizar */}
      {finish && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h3 className="font-bold text-lg">Finalizar consulta</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Diagnóstico</label>
              <textarea value={finish.diagnosis} onChange={(e) => setFinish({ ...finish, diagnosis: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tratamiento</label>
              <textarea value={finish.treatment} onChange={(e) => setFinish({ ...finish, treatment: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setFinish(null)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
              <button onClick={() => finishMutation.mutate(finish)}
                disabled={!finish.diagnosis || !finish.treatment}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
