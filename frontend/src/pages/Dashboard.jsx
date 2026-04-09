import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-5 text-white ${color}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-4xl font-bold mt-1">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data),
    refetchInterval: 15000, // refresca cada 15s
  })

  if (isLoading) return <p className="text-gray-500">Cargando dashboard...</p>

  const { stats, queue, in_attention, rooms } = data

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Dashboard en tiempo real</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="En espera"       value={stats.waiting}        color="bg-yellow-500" />
        <StatCard label="En atención"     value={stats.in_attention}   color="bg-blue-600" />
        <StatCard label="Atendidos hoy"   value={stats.attended_today} color="bg-green-600" />
        <StatCard label="Críticos (Rojo)" value={stats.critical}       color="bg-red-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cola de espera */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Cola de espera (por prioridad)</h3>
          {queue.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay pacientes en espera</p>
          ) : (
            <ul className="space-y-2">
              {queue.map((r, i) => (
                <li key={r.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs w-5">{i + 1}.</span>
                    <div>
                      <p className="font-medium text-sm">{r.patient?.name}</p>
                      <p className="text-xs text-gray-400">
                        Llegó: {new Date(r.arrived_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <TriageBadge level={r.triage_level} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* En atención */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-700 mb-3">En atención ahora</h3>
          {in_attention.length === 0 ? (
            <p className="text-gray-400 text-sm">Ningún paciente en atención</p>
          ) : (
            <ul className="space-y-2">
              {in_attention.map((r) => (
                <li key={r.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium text-sm">{r.patient?.name}</p>
                    <p className="text-xs text-gray-400">
                      Dr. {r.consultation?.doctor?.name} — {r.consultation?.room?.name}
                    </p>
                  </div>
                  <TriageBadge level={r.triage_level} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Salas */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Estado de salas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`rounded-lg p-3 border-2 ${room.is_available ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}
            >
              <p className="font-medium text-sm">{room.name}</p>
              <p className="text-xs text-gray-500">{room.type}</p>
              <p className={`text-xs font-semibold mt-1 ${room.is_available ? 'text-green-600' : 'text-red-600'}`}>
                {room.is_available ? 'Disponible' : 'Ocupada'}
              </p>
              {room.doctor && <p className="text-xs text-gray-400">{room.doctor.name}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
