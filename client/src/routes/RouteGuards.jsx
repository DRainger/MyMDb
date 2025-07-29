import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { userAPI } from '../services/api'
import { PageLoading } from '../components/Loading'

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
  const { token, user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      // If no token, no need to load profile
      if (!token) {
        setIsLoading(false)
        return
      }

      // If user data already exists, no need to fetch again
      if (user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        // Load user profile from API
        const userData = await userAPI.getProfile()
        setUser(userData)
      } catch (err) {
        console.error('Failed to load user profile:', err)
        setError(err.message)
        // If profile loading fails, clear auth state
        useAuthStore.getState().logout()
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [token, user, setUser])

  // Show loading state while fetching profile
  if (isLoading) {
    return <PageLoading text="טוען פרטי משתמש..." />
  }

  // Show error state if profile loading failed
  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-secondary border border-accent/20 shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">שגיאה בטעינת פרופיל</h2>
          <p className="text-text/70 mb-4">
            לא ניתן לטעון את פרטי המשתמש. אנא התחבר שוב.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent text-primary hover:bg-accentDark px-6 py-2 rounded-lg font-medium transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    )
  }

  return children
}

export { ProtectedRoute, PublicRoute, AuthLoader } 