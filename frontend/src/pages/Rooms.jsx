import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'

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
    onSuccess: () => { qc.invalidateQueries(['rooms']); setShowForm(false); setForm({ name: '', type: 'consultorio', assigned_doctor_id: '' }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/rooms/${id}`),
    onSuccess: () => qc.invalidateQueries(['rooms']),
  })

  if (isLoading) return <p className="text-gray-500">Cargando salas...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Salas y consultorios</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nueva sala
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="consultorio">Consultorio</option>
                <option value="urgencias">Urgencias</option>
                <option value="trauma">Trauma</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
            <button onClick={() => createMutation.mutate(form)} disabled={!form.name}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              Crear
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className={`bg-white rounded-xl shadow p-4 border-l-4 ${room.is_available ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{room.name}</p>
                <p className="text-xs text-gray-500 capitalize">{room.type}</p>
                {room.doctor && <p className="text-xs text-gray-400 mt-1">{room.doctor.name}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${room.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {room.is_available ? 'Libre' : 'Ocupada'}
              </span>
            </div>
            <button onClick={() => deleteMutation.mutate(room.id)}
              className="mt-3 text-xs text-red-400 hover:underline">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
