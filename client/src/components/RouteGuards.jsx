import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children, requiredRole, adminOnly }) => {
  const { token, user } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" replace />

  const notAuthorized =
    (adminOnly && user.role !== 'admin') ||
    (requiredRole && user.role !== requiredRole)

  if (notAuthorized) return <Navigate to="/dashboard" replace />

  return children
}

const PublicRoute = ({ children }) => {
  const { token, user } = useAuthStore()
  return token && user ? <Navigate to="/dashboard" replace /> : children
}

const AuthLoader = ({ children }) => {
  const { token } = useAuthStore()

  useEffect(() => {
    if (token) {
      // לדוגמה: authAPI.getProfile().then(setUser)
    }
  }, [token])

  return children
}

export { ProtectedRoute, PublicRoute, AuthLoader }
