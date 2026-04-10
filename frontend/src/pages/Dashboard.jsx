import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

const TYPE_META = {
  consultorio: { icon: '🏥', label: 'Consultorio' },
  urgencias:   { icon: '🚨', label: 'Urgencias' },
  trauma:      { icon: '🩹', label: 'Trauma' },
  quirofano:   { icon: '🔪', label: 'Quirófano' },
  uci:         { icon: '🫀', label: 'UCI' },
}

function StatCard({ label, value, color, icon, sub }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${color} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-4xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl opacity-60">{icon}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [roomFilter, setRoomFilter] = useState('todos')

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data),
    refetchInterval: 15000,
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Cargando dashboard...
    </div>
  )

  const { stats, queue, in_attention, rooms } = data
  const roomTypes = ['todos', ...new Set(rooms.map(r => r.type))]
  const filteredRooms = roomFilter === 'todos' ? rooms : rooms.filter(r => r.type === roomFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-0.5">Actualización automática cada 15 segundos</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
          En vivo
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="En espera"       value={stats.waiting}        color="bg-amber-500"   icon="⏳" sub="pacientes en cola" />
        <StatCard label="En atención"     value={stats.in_attention}   color="bg-blue-600"    icon="🩺" sub="siendo atendidos" />
        <StatCard label="Atendidos hoy"   value={stats.attended_today} color="bg-emerald-600" icon="✓"  sub="este turno" />
        <StatCard label="Críticos"        value={stats.critical}       color="bg-red-600"     icon="⚠" sub="nivel rojo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cola de espera */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Cola de espera</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{queue.length} pacientes</span>
          </div>
          <div className="divide-y divide-gray-50">
            {queue.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">No hay pacientes en espera</p>
            ) : (
              queue.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{r.patient?.name}</p>
                      <p className="text-xs text-gray-400">
                        Llegó: {new Date(r.arrived_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <TriageBadge level={r.triage_level} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* En atención */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">En atención ahora</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{in_attention.length} activos</span>
          </div>
          <div className="divide-y divide-gray-50">
            {in_attention.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">Ningún paciente en atención</p>
            ) : (
              in_attention.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{r.patient?.name}</p>
                    <p className="text-xs text-gray-400">
                      {r.consultation?.doctor?.name} · {r.consultation?.room?.name}
                    </p>
                  </div>
                  <TriageBadge level={r.triage_level} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Salas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-semibold text-gray-800">Estado de salas</h3>
          <div className="flex gap-2 flex-wrap">
            {roomTypes.map((t) => (
              <button
                key={t}
                onClick={() => setRoomFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition capitalize ${
                  roomFilter === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t === 'todos' ? 'Todas' : (TYPE_META[t]?.label ?? t)}
                <span className="ml-1 opacity-70">
                  ({t === 'todos' ? rooms.length : rooms.filter(r => r.type === t).length})
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className={`rounded-xl p-4 border-2 transition ${
                room.is_available
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{TYPE_META[room.type]?.icon ?? '🏥'}</span>
                <span className={`text-xs font-semibold ${room.is_available ? 'text-emerald-600' : 'text-red-600'}`}>
                  {room.is_available ? 'Libre' : 'Ocupada'}
                </span>
              </div>
              <p className="font-semibold text-sm text-gray-800">{room.name}</p>
              <p className="text-xs text-gray-400 capitalize">{TYPE_META[room.type]?.label ?? room.type}</p>
              {room.doctor && <p className="text-xs text-gray-500 mt-1 truncate">{room.doctor.name}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
