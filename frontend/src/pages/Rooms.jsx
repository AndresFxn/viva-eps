import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'

const TYPE_ICONS = { consultorio: '🏥', urgencias: '🚨', trauma: '🩹' }

export default function Rooms() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', type: 'consultorio', assigned_doctor_id: '' })
  const [showForm, setShowForm] = useState(false)

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/rooms', data),
    onSuccess: () => {
      qc.invalidateQueries(['rooms'])
      setShowForm(false)
      setForm({ name: '', type: 'consultorio', assigned_doctor_id: '' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/rooms/${id}`),
    onSuccess: () => qc.invalidateQueries(['rooms']),
  })

  if (isLoading) return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando salas...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salas y consultorios</h2>
          <p className="text-sm text-gray-400 mt-0.5">{rooms.length} salas registradas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Nueva sala
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Nueva sala</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Consultorio 3"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="consultorio">Consultorio</option>
                <option value="urgencias">Urgencias</option>
                <option value="trauma">Trauma</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.name}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              Crear sala
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition ${
              room.is_available ? 'border-emerald-200' : 'border-red-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{TYPE_ICONS[room.type] || '🏥'}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                room.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {room.is_available ? 'Disponible' : 'Ocupada'}
              </span>
            </div>
            <p className="font-bold text-gray-800">{room.name}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{room.type}</p>
            {room.doctor && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>👨‍⚕️</span> {room.doctor.name}
              </p>
            )}
            <button
              onClick={() => deleteMutation.mutate(room.id)}
              className="mt-4 text-xs text-red-400 hover:text-red-600 transition"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
