import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'

// TODO: בנה טופס התחברות
// TODO: הוסף validation לשדות
// TODO: חבר לחנות Zustand

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await login({ email, password })
    
    if (result.success) {
      navigate('/dashboard') // מעבר לדף הראשי אחרי התחברות מוצלחת
    }
  }

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-center mb-6">התחברות</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* שדה אימייל */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            אימייל
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="הכנס את האימייל שלך"
            required
          />
        </div>

        {/* שדה סיסמה */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            סיסמה
          </label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="הכנס את הסיסמה שלך"
            required
          />
        </div>

        {/* כפתור התחברות */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'מתחבר...' : 'התחבר'}
        </button>
      </form>

      {/* קישור לרישום */}
      <p className="text-center mt-4 text-gray-600">
        אין לך חשבון? 
        <Link to="/register" className="text-blue-500 hover:underline mr-1">הירשם</Link>
      </p>
    </div>
  )
}

export default Login
