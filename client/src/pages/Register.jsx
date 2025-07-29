import React, { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { ButtonLoading } from '../components/Loading'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { register, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Calculate password strength
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password)
    setPasswordStrength(strength)
  }, [formData.password])

  const calculatePasswordStrength = (password) => {
    if (!password) return 0
    
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    return strength
  }

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'חלשה מאוד', color: 'text-red-400', bg: 'bg-red-500' }
      case 2:
        return { text: 'חלשה', color: 'text-orange-400', bg: 'bg-orange-500' }
      case 3:
        return { text: 'בינונית', color: 'text-yellow-400', bg: 'bg-yellow-500' }
      case 4:
        return { text: 'חזקה', color: 'text-blue-400', bg: 'bg-blue-500' }
      case 5:
        return { text: 'חזקה מאוד', color: 'text-green-400', bg: 'bg-green-500' }
      default:
        return { text: '', color: '', bg: '' }
    }
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'שם הוא שדה חובה'
        if (value.length < 2) return 'שם חייב להכיל לפחות 2 תווים'
        if (!/^[א-ת\s]+$/.test(value)) return 'שם חייב להכיל רק אותיות בעברית'
        return ''
      case 'email':
        if (!value) return 'אימייל הוא שדה חובה'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'אנא הכנס כתובת אימייל תקינה'
        }
        return ''
      case 'password':
        if (!value) return 'סיסמה היא שדה חובה'
        if (value.length < 8) return 'סיסמה חייבת להכיל לפחות 8 תווים'
        if (passwordStrength < 3) return 'סיסמה חייבת להיות חזקה יותר'
        return ''
      case 'confirmPassword':
        if (!value) return 'אימות סיסמה הוא שדה חובה'
        if (value !== formData.password) return 'הסיסמאות לא תואמות'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
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

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName]
  }

  const strengthInfo = getPasswordStrengthText(passwordStrength)

  return (
    <div className="min-h-screen bg-primary text-text">
      <div className="main-container py-6 md:py-10">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
                יצירת חשבון חדש
              </h1>
              <p className="text-text/80 text-base">
                מלא את הפרטים להרשמה
              </p>
            </div>
            
            <div className="form-container">
              {error && (
                <div className="error-message mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field">
                  <label htmlFor="name" className="form-field label">
                    שם מלא
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${getFieldError('name') ? 'error' : ''}`}
                    placeholder="הכנס את השם המלא שלך"
                    required
                  />
                  {getFieldError('name') && (
                    <p className="form-field error-text">{errors.name}</p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-field label">
                    כתובת אימייל
                  </label>
                  <input 
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${getFieldError('email') ? 'error' : ''}`}
                    placeholder="הכנס את האימייל שלך"
                    required
                  />
                  {getFieldError('email') && (
                    <p className="form-field error-text">{errors.email}</p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="password" className="form-field label">
                    סיסמה
                  </label>
                  <input 
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${getFieldError('password') ? 'error' : ''}`}
                    placeholder="הכנס סיסמה"
                    required
                  />
                  {formData.password && (
                    <div className="mt-3 p-3 bg-primary/50 rounded-lg border border-accent/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 w-8 rounded-full transition-colors ${
                                level <= passwordStrength
                                  ? strengthInfo.bg
                                  : 'bg-text/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-medium ${strengthInfo.color}`}>
                          {strengthInfo.text}
                        </span>
                      </div>
                      <p className="text-xs text-text/60">
                        סיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד
                      </p>
                    </div>
                  )}
                  {getFieldError('password') && (
                    <p className="form-field error-text">{errors.password}</p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPassword" className="form-field label">
                    אימות סיסמה
                  </label>
                  <input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${getFieldError('confirmPassword') ? 'error' : ''}`}
                    placeholder="הכנס את הסיסמה שוב"
                    required
                  />
                  {getFieldError('confirmPassword') && (
                    <p className="form-field error-text">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? (
                      <ButtonLoading text="נרשם..." />
                    ) : (
                      'הירשם'
                    )}
                  </button>
                </div>
              </form>

              <div className="divider">
                <div className="divider-text">
                  <span>או</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-text/70 text-sm">
                  יש לך כבר חשבון?{' '}
                  <Link to="/login" className="font-medium text-accent hover:text-accentDark transition-colors">
                    התחבר עכשיו
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register