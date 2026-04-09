import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'

const LEVEL_LABELS = { 1: 'Rojo (Crítico)', 2: 'Naranja (Urgente)', 3: 'Amarillo (Moderado)', 4: 'Verde (Leve)', 5: 'Azul (No urgente)' }
const LEVEL_COLORS = { 1: 'bg-red-500', 2: 'bg-orange-500', 3: 'bg-yellow-400', 4: 'bg-green-500', 5: 'bg-blue-400' }

export default function Reports() {
  const today = new Date().toISOString().split('T')[0]
  const [from, setFrom] = useState(today + 'T00:00:00')
  const [to, setTo] = useState(today + 'T23:59:59')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', from, to],
    queryFn: () => api.get('/reports/summary', { params: { from, to } }).then((r) => r.data),
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Reportes y estadísticas</h2>

      <div className="bg-white rounded-xl shadow p-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Desde</label>
          <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hasta</label>
          <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={() => refetch()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          Actualizar
        </button>
      </div>

      {isLoading ? <p className="text-gray-500">Cargando reporte...</p> : data && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Por nivel */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4">Pacientes por nivel de triage</h3>
            <div className="space-y-3">
              {data.by_triage_level.map((item) => (
                <div key={item.triage_level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{LEVEL_LABELS[item.triage_level]}</span>
                    <span className="font-bold">{item.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`h-3 rounded-full ${LEVEL_COLORS[item.triage_level]}`}
                      style={{ width: `${Math.min(100, (item.total / Math.max(...data.by_triage_level.map(i => i.total))) * 100)}%` }} />
                  </div>
                </div>
              ))}
              {data.by_triage_level.length === 0 && <p className="text-gray-400 text-sm">Sin datos</p>}
            </div>
          </div>

          {/* Por estado */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4">Por estado</h3>
            <div className="space-y-2">
              {data.by_status.map((item) => (
                <div key={item.status} className="flex justify-between text-sm border-b pb-2">
                  <span className="capitalize">{item.status.replace('_', ' ')}</span>
                  <span className="font-bold">{item.total}</span>
                </div>
              ))}
              {data.by_status.length === 0 && <p className="text-gray-400 text-sm">Sin datos</p>}
            </div>
          </div>

          {/* Tiempo promedio */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-2">Tiempo promedio de espera</h3>
            <p className="text-4xl font-bold text-blue-600">{data.avg_wait_minutes || 0} <span className="text-lg font-normal text-gray-500">min</span></p>
          </div>

          {/* Por doctor */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4">Consultas por doctor</h3>
            <div className="space-y-2">
              {data.consultations_by_doctor.map((item) => (
                <div key={item.doctor_id} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.doctor?.name || `Doctor #${item.doctor_id}`}</span>
                  <span className="font-bold">{item.total_consultations}</span>
                </div>
              ))}
              {data.consultations_by_doctor.length === 0 && <p className="text-gray-400 text-sm">Sin datos</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
