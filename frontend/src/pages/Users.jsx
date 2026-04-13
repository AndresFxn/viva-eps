import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'

const ROLE_COLORS = {
  doctor: 'bg-blue-100 text-blue-700',
  nurse:  'bg-green-100 text-green-700',
}

const EMPTY_FORM = { name: '', email: '', password: '', role: 'doctor' }

export default function Users() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterRole, setFilterRole] = useState('todos')

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/users', data),
    onSuccess: () => {
      qc.invalidateQueries(['users'])
      setShowForm(false)
      setForm(EMPTY_FORM)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries(['users']),
  })

  const filtered = filterRole === 'todos' ? users : users.filter((u) => u.role === filterRole)

  if (isLoading) return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando usuarios...</div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal médico</h2>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
        >
          <span className="text-lg leading-none">+</span> Nuevo usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {['todos', 'doctor', 'nurse'].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize ${
              filterRole === r ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {r === 'todos' ? 'Todos' : r === 'doctor' ? 'Doctores' : 'Enfermeros'}
            <span className="ml-1 opacity-70">({r === 'todos' ? users.length : users.filter(u => u.role === r).length})</span>
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Nuevo usuario</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nombre completo</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Juan Pérez"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Correo</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="doctor@triage.com" type="email"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres" type="password"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Rol</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="doctor">Doctor</option>
                <option value="nurse">Enfermero/a</option>
              </select>
            </div>
          </div>
          {createMutation.isError && (
            <p className="text-xs text-red-500">Error al crear usuario. Verifica que el correo no esté en uso.</p>
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancelar</button>
            <button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.name || !form.email || !form.password || createMutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              Crear usuario
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 text-left font-medium">Nombre</th>
              <th className="px-5 py-3 text-left font-medium hidden sm:table-cell">Correo</th>
              <th className="px-5 py-3 text-left font-medium">Rol</th>
              <th className="px-5 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-semibold text-gray-800">{u.name}</td>
                <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">{u.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ROLE_COLORS[u.role]}`}>
                    {u.role === 'doctor' ? 'Doctor' : 'Enfermero/a'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => deleteMutation.mutate(u.id)} className="text-xs text-red-400 hover:text-red-600 transition">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-12">No hay usuarios registrados</p>}
      </div>
    </div>
  )
}
