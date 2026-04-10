import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'

const TYPE_META = {
  consultorio: { icon: '🏥', label: 'Consultorio' },
  urgencias:   { icon: '🚨', label: 'Urgencias' },
  trauma:      { icon: '🩹', label: 'Trauma' },
  quirofano:   { icon: '🔪', label: 'Quirófano' },
  uci:         { icon: '🫀', label: 'UCI' },
}

const FILTERS = ['todos', 'consultorio', 'urgencias', 'trauma', 'quirofano', 'uci']

export default function Rooms() {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', type: 'consultorio', assigned_doctor_id: '' })
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('todos')

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

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }) => api.patch(`/rooms/${id}`, { is_available }),
    onSuccess: () => qc.invalidateQueries(['rooms']),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/rooms/${id}`),
    onSuccess: () => qc.invalidateQueries(['rooms']),
  })

  const filtered = filter === 'todos' ? rooms : rooms.filter((r) => r.type === filter)
  const available = rooms.filter((r) => r.is_available).length

  if (isLoading) return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando salas...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Salas y consultorios</h2>
          <p className="text-sm text-gray-400 mt-0.5">{available} disponibles de {rooms.length} salas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Nueva sala
        </button>
      </div>

      {/* Filtros por tipo */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {f === 'todos' ? 'Todos' : TYPE_META[f]?.label ?? f}
            {f !== 'todos' && (
              <span className="ml-1 opacity-70">
                ({rooms.filter((r) => r.type === f).length})
              </span>
            )}
          </button>
        ))}
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
                placeholder="Ej: Quirófano 4"
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
                {Object.entries(TYPE_META).map(([val, { label }]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
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
        {filtered.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-2xl border-2 shadow-sm p-5 transition ${
              room.is_available ? 'border-emerald-200' : 'border-red-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{TYPE_META[room.type]?.icon ?? '🏥'}</span>
              <button
                onClick={() => toggleMutation.mutate({ id: room.id, is_available: !room.is_available })}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition ${
                  room.is_available
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {room.is_available ? 'Disponible' : 'Ocupada'}
              </button>
            </div>
            <p className="font-bold text-gray-800">{room.name}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{TYPE_META[room.type]?.label ?? room.type}</p>
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
