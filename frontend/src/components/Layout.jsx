import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const navLinks = [
  { to: '/dashboard',     label: 'Dashboard',  roles: ['admin', 'doctor', 'nurse'] },
  { to: '/queue',         label: 'Cola',        roles: ['admin', 'doctor', 'nurse'] },
  { to: '/patients',      label: 'Pacientes',   roles: ['admin', 'doctor', 'nurse'] },
  { to: '/triage/new',    label: 'Nuevo Triage',roles: ['admin', 'nurse'] },
  { to: '/consultations', label: 'Consultas',   roles: ['admin', 'doctor'] },
  { to: '/rooms',         label: 'Salas',       roles: ['admin'] },
  { to: '/reports',       label: 'Reportes',    roles: ['admin', 'doctor'] },
]

export default function Layout({ children }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const visibleLinks = navLinks.filter((l) => l.roles.includes(user?.role))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">🏥 Triage</span>
          {visibleLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm hover:text-blue-200 ${location.pathname === l.to ? 'underline font-semibold' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="opacity-80">{user?.name} ({user?.role})</span>
          <button onClick={handleLogout} className="bg-blue-800 px-3 py-1 rounded hover:bg-blue-900">
            Salir
          </button>
        </div>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
