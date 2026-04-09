import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

const STATUS_LABELS = {
  waiting: 'En espera',
  in_attention: 'En atención',
  attended: 'Atendido',
  transferred: 'Transferido',
  discharged: 'Alta',
}

const STATUS_COLORS = {
  waiting:      'bg-amber-100 text-amber-700',
  in_attention: 'bg-blue-100 text-blue-700',
  attended:     'bg-emerald-100 text-emerald-700',
  transferred:  'bg-purple-100 text-purple-700',
  discharged:   'bg-gray-100 text-gray-600',
}

export default function Patients() {
  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients').then((r) => r.data),
  })

  const patients = data?.data || []

  if (isLoading) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Cargando pacientes...</div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pacientes</h2>
        <p className="text-sm text-gray-400 mt-0.5">{patients.length} registros</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 text-left font-medium">Nombre</th>
              <th className="px-5 py-3 text-left font-medium hidden sm:table-cell">Documento</th>
              <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Edad</th>
              <th className="px-5 py-3 text-left font-medium">Último triage</th>
              <th className="px-5 py-3 text-left font-medium">Estado</th>
              <th className="px-5 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-semibold text-gray-800">{p.name}</td>
                <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">{p.document}</td>
                <td className="px-5 py-4 text-gray-600 hidden md:table-cell">{p.age} años</td>
                <td className="px-5 py-4">
                  {p.latest_triage
                    ? <TriageBadge level={p.latest_triage.triage_level} />
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-4">
                  {p.latest_triage ? (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[p.latest_triage.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[p.latest_triage.status] || p.latest_triage.status}
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-4">
                  <Link
                    to={`/patients/${p.id}`}
                    className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                  >
                    Ver historial →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && (
          <p className="text-center text-gray-400 py-12">No hay pacientes registrados</p>
        )}
      </div>
    </div>
  )
}
