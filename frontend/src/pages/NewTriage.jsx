import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../lib/axios'

export default function NewTriage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=buscar paciente, 2=triage
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [newPatient, setNewPatient] = useState({ name: '', document: '', age: '', gender: 'M' })
  const [form, setForm] = useState({
    triage_level: 3, symptoms: '', heart_rate: '', blood_pressure_sys: '',
    blood_pressure_dia: '', temperature: '', oxygen_saturation: '',
  })

  const { data: patients = [] } = useQuery({
    queryKey: ['patients-search', patientSearch],
    queryFn: () => api.get('/patients', { params: { search: patientSearch } }).then((r) => r.data.data || []),
    enabled: patientSearch.length > 2,
  })

  const createPatientMutation = useMutation({
    mutationFn: (data) => api.post('/patients', data).then((r) => r.data),
    onSuccess: (patient) => { setSelectedPatient(patient); setStep(2) },
  })

  const triageMutation = useMutation({
    mutationFn: (data) => api.post('/triage', data),
    onSuccess: () => navigate('/queue'),
  })

  const handleTriageSubmit = (e) => {
    e.preventDefault()
    triageMutation.mutate({
      ...form,
      patient_id: selectedPatient.id,
      triage_level: Number(form.triage_level),
    })
  }

  const LEVEL_COLORS = { 1: 'bg-red-100 border-red-400', 2: 'bg-orange-100 border-orange-400', 3: 'bg-yellow-100 border-yellow-400', 4: 'bg-green-100 border-green-400', 5: 'bg-blue-100 border-blue-400' }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Nuevo Triage</h2>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-semibold">Paso 1: Identificar paciente</h3>
          <input
            placeholder="Buscar por nombre o documento..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          {patients.length > 0 && (
            <ul className="border rounded-lg divide-y">
              {patients.map((p) => (
                <li key={p.id}
                  onClick={() => { setSelectedPatient(p); setStep(2) }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  {p.name} — {p.document} — {p.age} años
                </li>
              ))}
            </ul>
          )}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">O registrar nuevo paciente:</p>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre completo" value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Documento" value={newPatient.document}
                onChange={(e) => setNewPatient({ ...newPatient, document: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Edad" type="number" value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm" />
              <select value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <button
              onClick={() => createPatientMutation.mutate(newPatient)}
              disabled={!newPatient.name || !newPatient.document || !newPatient.age}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Registrar y continuar
            </button>
          </div>
        </div>
      )}

      {step === 2 && selectedPatient && (
        <form onSubmit={handleTriageSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Paso 2: Clasificación — {selectedPatient.name}</h3>
            <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 hover:underline">Cambiar paciente</button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nivel de triage</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { l: 1, label: 'Rojo\nCrítico' },
                { l: 2, label: 'Naranja\nUrgente' },
                { l: 3, label: 'Amarillo\nModerado' },
                { l: 4, label: 'Verde\nLeve' },
                { l: 5, label: 'Azul\nNo urgente' },
              ].map(({ l, label }) => (
                <button
                  key={l} type="button"
                  onClick={() => setForm({ ...form, triage_level: l })}
                  className={`border-2 rounded-lg p-2 text-xs font-semibold text-center whitespace-pre-line ${LEVEL_COLORS[l]} ${form.triage_level === l ? 'ring-2 ring-offset-1 ring-gray-600' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Síntomas *</label>
            <textarea required value={form.symptoms}
              onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" rows={3} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'heart_rate', label: 'FC (lpm)' },
              { key: 'blood_pressure_sys', label: 'PA sistólica' },
              { key: 'blood_pressure_dia', label: 'PA diastólica' },
              { key: 'temperature', label: 'Temperatura (°C)' },
              { key: 'oxygen_saturation', label: 'SpO2 (%)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input type="number" value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate('/queue')} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
            <button type="submit" disabled={triageMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {triageMutation.isPending ? 'Guardando...' : 'Registrar triage'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
