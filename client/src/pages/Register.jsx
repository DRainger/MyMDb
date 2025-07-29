import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useAuth } from '../hooks'
import { ButtonLoading } from '../components/Loading'

const Register = () => {
  const { register, loading, error, clearError } = useAuth()

  // Form validation rules
  const validationRules = {
    name: [
      (value) => !value ? 'שם הוא שדה חובה' : '',
      (value) => value.length < 2 ? 'שם חייב להכיל לפחות 2 תווים' : '',
      (value) => !/^[א-ת\s]+$/.test(value) ? 'שם חייב להכיל רק אותיות בעברית' : ''
    ],
    email: [
      (value) => !value ? 'אימייל הוא שדה חובה' : '',
      (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'אנא הכנס כתובת אימייל תקינה' : ''
    ],
    password: [
      (value) => !value ? 'סיסמה היא שדה חובה' : '',
      (value) => value.length < 8 ? 'סיסמה חייבת להכיל לפחות 8 תווים' : '',
      (value, allValues) => {
        const strength = calculatePasswordStrength(value)
        return strength < 3 ? 'סיסמה חייבת להיות חזקה יותר' : ''
      }
    ],
    confirmPassword: [
      (value) => !value ? 'אימות סיסמה הוא שדה חובה' : '',
      (value, allValues) => value !== allValues.password ? 'הסיסמאות לא תואמות' : ''
    ]
  }

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError
  } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }, validationRules)

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Calculate password strength
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

  const onSubmit = async (formData) => {
    return await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    await handleSubmit(onSubmit)
  }

  const passwordStrength = calculatePasswordStrength(values.password)
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
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="form-field">
                  <label htmlFor="name" className="form-field label">
                    שם מלא
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
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
                    value={values.email}
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
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${getFieldError('password') ? 'error' : ''}`}
                    placeholder="הכנס סיסמה"
                    required
                  />
                  {values.password && (
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
                    value={values.confirmPassword}
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
                    disabled={isSubmitting || loading}
                    className="btn-primary w-full"
                  >
                    {isSubmitting || loading ? (
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