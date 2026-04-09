import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children, roles }) {
  const { token, user, fetchMe } = useAuthStore()
  const [loading, setLoading] = useState(!user && !!token)

  useEffect(() => {
    if (token && !user) {
      fetchMe().finally(() => setLoading(false))
    }
  }, [token, user, fetchMe])

  if (!token) return <Navigate to="/login" replace />
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return children
}
