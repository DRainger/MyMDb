import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Login failed')
          }

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
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed')
          }

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