import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const navLinks = [
  { to: '/dashboard',     label: 'Dashboard',     icon: '▦', roles: ['admin', 'doctor', 'nurse'] },
  { to: '/queue',         label: 'Cola',           icon: '≡', roles: ['admin', 'doctor', 'nurse'] },
  { to: '/patients',      label: 'Pacientes',      icon: '👤', roles: ['admin', 'doctor', 'nurse'] },
  { to: '/triage/new',    label: 'Nuevo Triage',   icon: '+', roles: ['admin', 'nurse', 'doctor'] },
  { to: '/consultations', label: 'Consultas',      icon: '🩺', roles: ['admin', 'doctor'] },
  { to: '/rooms',         label: 'Salas',          icon: '🚪', roles: ['admin'] },
  { to: '/reports',       label: 'Reportes',       icon: '📊', roles: ['admin', 'doctor'] },
]

const ROLE_COLORS = {
  admin:  'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  nurse:  'bg-green-100 text-green-700',
}

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between shadow-sm sticky top-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2.5 py-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">Viva EPS</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center">
            {visibleLinks.map((l) => {
              const active = location.pathname === l.to || location.pathname.startsWith(l.to + '/')
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
                  }`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Usuario */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[user?.role] || 'bg-gray-100 text-gray-600'}`}>
            {user?.role}
          </span>
          <span className="text-sm text-gray-700 font-medium hidden sm:block">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
