import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../lib/axios'

const LEVEL_LABELS = {
  1: 'Rojo — Crítico',
  2: 'Naranja — Urgente',
  3: 'Amarillo — Moderado',
  4: 'Verde — Leve',
  5: 'Azul — No urgente',
}
const LEVEL_COLORS = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-400',
  4: 'bg-emerald-500',
  5: 'bg-blue-400',
}

export default function Reports() {
  const today = new Date().toISOString().split('T')[0]
  const [from, setFrom] = useState(today + 'T00:00:00')
  const [to, setTo]     = useState(today + 'T23:59:59')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', from, to],
    queryFn: () => api.get('/reports/summary', { params: { from, to } }).then((r) => r.data),
  })

  const maxLevel = data ? Math.max(...data.by_triage_level.map((i) => Number(i.total)), 1) : 1

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
        <p className="text-sm text-gray-400 mt-0.5">Estadísticas agregadas por período</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Desde</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Hasta</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
        >
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando reporte...</div>
      ) : data && (
        <div className="grid md:grid-cols-2 gap-5">

          {/* Tiempo promedio */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">⏱</div>
            <div>
              <p className="text-sm text-gray-500">Tiempo promedio de espera</p>
              <p className="text-4xl font-bold text-blue-600 mt-1">
                {data.avg_wait_minutes || 0}
                <span className="text-lg font-normal text-gray-400 ml-1">min</span>
              </p>
            </div>
          </div>

          {/* Total por estado */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Por estado</h3>
            <div className="space-y-2">
              {data.by_status.length === 0 && <p className="text-gray-400 text-sm">Sin datos</p>}
              {data.by_status.map((item) => (
                <div key={item.status} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 capitalize">{item.status.replace('_', ' ')}</span>
                  <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">{item.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Por nivel de triage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Por nivel de triage</h3>
            <div className="space-y-3">
              {data.by_triage_level.length === 0 && <p className="text-gray-400 text-sm">Sin datos</p>}
              {data.by_triage_level.map((item) => (
                <div key={item.triage_level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{LEVEL_LABELS[item.triage_level]}</span>
                    <span className="font-bold text-gray-800">{item.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${LEVEL_COLORS[item.triage_level]}`}
                      style={{ width: `${Math.min(100, (item.total / maxLevel) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Por doctor */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Consultas por doctor</h3>
            <div className="space-y-3">
              {data.consultations_by_doctor.length === 0 && <p className="text-gray-400 text-sm">Sin datos</p>}
              {data.consultations_by_doctor.map((item) => (
                <div key={item.doctor_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">
                      {(item.doctor?.name || 'D').charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700">{item.doctor?.name || `Doctor #${item.doctor_id}`}</span>
                  </div>
                  <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">
                    {item.total_consultations}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
