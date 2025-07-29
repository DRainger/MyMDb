import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export const useAuth = () => {
  const { 
    user, 
    token, 
    loading, 
    error, 
    login, 
    register, 
    logout, 
    clearError,
    isAuthenticated,
    getUserRole,
    isAdmin 
  } = useAuthStore()
  
  const navigate = useNavigate()

  const handleLogin = useCallback(async (credentials) => {
    const result = await login(credentials)
    if (result.success) {
      navigate('/dashboard')
    }
    return result
  }, [login, navigate])

  const handleRegister = useCallback(async (userData) => {
    const result = await register(userData)
    if (result.success) {
      navigate('/dashboard')
    }
    return result
  }, [register, navigate])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  const checkAuth = useCallback(() => {
    return isAuthenticated()
  }, [isAuthenticated])

  const checkRole = useCallback((requiredRole) => {
    const userRole = getUserRole()
    return userRole === requiredRole
  }, [getUserRole])

  const checkAdmin = useCallback(() => {
    return isAdmin()
  }, [isAdmin])

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated: checkAuth(),
    isAdmin: checkAdmin(),
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
    
    // Utilities
    checkRole,
    checkAdmin,
    checkAuth
  }
} 