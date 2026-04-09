const LEVELS = {
  1: { label: 'Rojo - Crítico',    bg: 'bg-red-600',    text: 'text-white' },
  2: { label: 'Naranja - Urgente', bg: 'bg-orange-500', text: 'text-white' },
  3: { label: 'Amarillo - Urgente',bg: 'bg-yellow-400', text: 'text-black' },
  4: { label: 'Verde - Poco urgente', bg: 'bg-green-500', text: 'text-white' },
  5: { label: 'Azul - No urgente', bg: 'bg-blue-400',   text: 'text-white' },
}

export default function TriageBadge({ level }) {
  const config = LEVELS[level] || { label: 'Desconocido', bg: 'bg-gray-400', text: 'text-white' }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
