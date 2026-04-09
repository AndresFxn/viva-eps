import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

const STATUS_LABELS = {
  waiting: 'En espera',
  in_attention: 'En atención',
  attended: 'Atendido',
  transferred: 'Transferido',
  discharged: 'Dado de alta',
}

const STATUS_COLORS = {
  waiting: 'bg-yellow-100 text-yellow-700',
  in_attention: 'bg-blue-100 text-blue-700',
  attended: 'bg-green-100 text-green-700',
  transferred: 'bg-purple-100 text-purple-700',
  discharged: 'bg-gray-100 text-gray-600',
}

export default function PatientDetail() {
  const { id } = useParams()

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => api.get(`/patients/${id}`).then((r) => r.data),
  })

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (!patient) return <p className="text-red-500">Paciente no encontrado</p>

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/patients" className="text-blue-600 hover:underline text-sm">← Volver</Link>
        <h2 className="text-xl font-bold text-gray-800">Historial de {patient.name}</h2>
      </div>

      {/* Datos del paciente */}
      <div className="bg-white rounded-xl shadow p-5 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div><span className="text-gray-500">Documento:</span> {patient.document}</div>
        <div><span className="text-gray-500">Edad:</span> {patient.age} años</div>
        <div><span className="text-gray-500">Género:</span> {patient.gender}</div>
        <div><span className="text-gray-500">Teléfono:</span> {patient.phone || '—'}</div>
        {patient.notes && <div className="col-span-2"><span className="text-gray-500">Notas:</span> {patient.notes}</div>}
      </div>

      {/* Historial de triages */}
      <h3 className="font-semibold text-gray-700">Historial de atenciones ({patient.triage_records?.length || 0})</h3>

      {patient.triage_records?.length === 0 && (
        <p className="text-gray-400 text-sm">Sin registros de triage</p>
      )}

      <div className="space-y-4">
        {patient.triage_records?.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow p-5 space-y-3">
            {/* Cabecera */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TriageBadge level={record.triage_level} />
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[record.status] || 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[record.status] || record.status}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(record.arrived_at).toLocaleString()}
              </span>
            </div>

            {/* Signos vitales y síntomas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="col-span-2 md:col-span-3">
                <span className="text-gray-500">Síntomas: </span>{record.symptoms}
              </div>
              {record.heart_rate && <div><span className="text-gray-500">FC:</span> {record.heart_rate} lpm</div>}
              {record.blood_pressure_sys && (
                <div><span className="text-gray-500">PA:</span> {record.blood_pressure_sys}/{record.blood_pressure_dia}</div>
              )}
              {record.temperature && <div><span className="text-gray-500">Temp:</span> {record.temperature}°C</div>}
              {record.oxygen_saturation && <div><span className="text-gray-500">SpO2:</span> {record.oxygen_saturation}%</div>}
              <div><span className="text-gray-500">Enfermero:</span> {record.nurse?.name}</div>
            </div>

            {/* Historial de reclasificaciones */}
            {record.history?.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-orange-600 mb-2">Reclasificaciones</p>
                <ul className="space-y-1">
                  {record.history.map((h) => (
                    <li key={h.id} className="text-xs border-l-4 border-orange-400 pl-2">
                      <span className="font-medium">Nivel {h.previous_level} → {h.new_level}</span>
                      <span className="text-gray-500 ml-1">por {h.changed_by?.name}</span>
                      <p className="text-gray-400">{h.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Consulta */}
            {record.consultation && (
              <div className="border-t pt-3 text-sm space-y-1">
                <p className="text-xs font-semibold text-blue-600 mb-1">Consulta médica</p>
                <p><span className="text-gray-500">Doctor:</span> {record.consultation.doctor?.name}</p>
                <p><span className="text-gray-500">Sala:</span> {record.consultation.room?.name}</p>
                {record.consultation.diagnosis && (
                  <p><span className="text-gray-500">Diagnóstico:</span> {record.consultation.diagnosis}</p>
                )}
                {record.consultation.treatment && (
                  <p><span className="text-gray-500">Tratamiento:</span> {record.consultation.treatment}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
