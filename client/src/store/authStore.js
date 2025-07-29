import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api.js'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const data = await authAPI.login(credentials)

          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          set({
            loading: false,
            error: error.message,
          })
          return { success: false, error: error.message }
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null })
        try {
          const data = await authAPI.register(userData)

          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          set({
            loading: false,
            error: error.message,
          })
          return { success: false, error: error.message }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          loading: false,
          error: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setUser: (user) => {
        set({ user })
      },

      setToken: (token) => {
        set({ token })
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const { user, token } = get()
        return !!(user && token)
      },

      // Get user role
      getUserRole: () => {
        const { user } = get()
        return user?.role || 'user'
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)

export default useAuthStore 