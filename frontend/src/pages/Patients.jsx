import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import TriageBadge from '../components/TriageBadge'

export default function Patients() {
  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients').then((r) => r.data),
  })

  const patients = data?.data || []

  if (isLoading) return <p className="text-gray-500">Cargando pacientes...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Pacientes</h2>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Edad</th>
              <th className="px-4 py-3">Último triage</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.document}</td>
                <td className="px-4 py-3">{p.age}</td>
                <td className="px-4 py-3">
                  {p.latest_triage ? <TriageBadge level={p.latest_triage.triage_level} /> : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  {p.latest_triage ? (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.latest_triage.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                      p.latest_triage.status === 'in_attention' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.latest_triage.status}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <Link to={`/patients/${p.id}`} className="text-blue-600 hover:underline text-xs">Ver historial</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && (
          <p className="text-center text-gray-400 py-8">No hay pacientes registrados</p>
        )}
      </div>
    </div>
  )
}
