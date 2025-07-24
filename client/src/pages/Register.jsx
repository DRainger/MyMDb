import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { register, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('הסיסמאות לא תואמות')
      return
    }
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="content-wrapper">
      <div className="form-container">
        <h2 className="text-2xl font-bold text-center mb-6">הרשמה</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              שם מלא
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="הכנס את השם המלא שלך"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              אימייל
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="הכנס את האימייל שלך"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              סיסמה
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="הכנס סיסמה"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              אימות סיסמה
            </label>
            <input 
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="הכנס את הסיסמה שוב"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'נרשם...' : 'הירשם'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          יש לך כבר חשבון? 
          <Link to="/login" className="text-blue-500 hover:underline mr-1">התחבר</Link>
        </p>
      </div>
    </div>
  )
}

export default Register