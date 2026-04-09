import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

export default function TriageDetail() {
  const { id } = useParams()
  const { data: record, isLoading } = useQuery({
    queryKey: ['triage', id],
    queryFn: () => api.get(`/triage/${id}`).then((r) => r.data),
  })

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (!record) return <p className="text-red-500">No encontrado</p>

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/queue" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h2 className="text-xl font-bold text-gray-800">Detalle de Triage #{record.id}</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">{record.patient?.name}</p>
            <p className="text-sm text-gray-500">Doc: {record.patient?.document} — {record.patient?.age} años</p>
          </div>
          <TriageBadge level={record.triage_level} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Síntomas:</span> {record.symptoms}</div>
          <div><span className="text-gray-500">Estado:</span> {record.status}</div>
          <div><span className="text-gray-500">FC:</span> {record.heart_rate || '—'} lpm</div>
          <div><span className="text-gray-500">PA:</span> {record.blood_pressure_sys}/{record.blood_pressure_dia || '—'}</div>
          <div><span className="text-gray-500">Temp:</span> {record.temperature || '—'} °C</div>
          <div><span className="text-gray-500">SpO2:</span> {record.oxygen_saturation || '—'} %</div>
          <div><span className="text-gray-500">Llegó:</span> {new Date(record.arrived_at).toLocaleString()}</div>
          <div><span className="text-gray-500">Enfermero:</span> {record.nurse?.name}</div>
        </div>
      </div>

      {record.history?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-3">Historial de reclasificaciones</h3>
          <ul className="space-y-2">
            {record.history.map((h) => (
              <li key={h.id} className="text-sm border-l-4 border-orange-400 pl-3">
                <span className="font-medium">Nivel {h.previous_level} → {h.new_level}</span>
                <span className="text-gray-500 ml-2">por {h.changed_by?.name}</span>
                <p className="text-gray-400">{h.reason}</p>
                <p className="text-xs text-gray-300">{new Date(h.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.consultation && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-3">Consulta</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-500">Doctor:</span> {record.consultation.doctor?.name}</p>
            <p><span className="text-gray-500">Sala:</span> {record.consultation.room?.name}</p>
            <p><span className="text-gray-500">Inicio:</span> {new Date(record.consultation.started_at).toLocaleString()}</p>
            {record.consultation.ended_at && (
              <>
                <p><span className="text-gray-500">Fin:</span> {new Date(record.consultation.ended_at).toLocaleString()}</p>
                <p><span className="text-gray-500">Diagnóstico:</span> {record.consultation.diagnosis}</p>
                <p><span className="text-gray-500">Tratamiento:</span> {record.consultation.treatment}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
