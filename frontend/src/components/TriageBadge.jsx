const LEVELS = {
  1: { label: 'Crítico',     bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  2: { label: 'Urgente',     bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  3: { label: 'Moderado',    bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  4: { label: 'Leve',        bg: 'bg-emerald-100',text: 'text-emerald-700',dot: 'bg-emerald-500' },
  5: { label: 'No urgente',  bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400' },
}

export default function TriageBadge({ level }) {
  const c = LEVELS[level] || { label: 'Desconocido', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      N{level} · {c.label}
    </span>
  )
}
