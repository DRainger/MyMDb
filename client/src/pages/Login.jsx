import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useAuth } from '../hooks'
import { ButtonLoading } from '../components/Loading'

const Login = () => {
  const { login, loading, error, clearError } = useAuth()

  // Form validation rules
  const validationRules = {
    email: [
      (value) => !value ? 'אימייל הוא שדה חובה' : '',
      (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'אנא הכנס כתובת אימייל תקינה' : ''
    ],
    password: [
      (value) => !value ? 'סיסמה היא שדה חובה' : '',
      (value) => value.length < 6 ? 'סיסמה חייבת להכיל לפחות 6 תווים' : ''
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
    email: '',
    password: ''
  }, validationRules)

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const onSubmit = async (formData) => {
    return await login(formData)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    await handleSubmit(onSubmit)
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      <div className="main-container py-6 md:py-10">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
                התחברות לחשבון
              </h1>
              <p className="text-text/80 text-base">
                הכנס את פרטי ההתחברות שלך
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
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input-field ${getFieldError('password') ? 'error' : ''}`}
                    placeholder="הכנס את הסיסמה שלך"
                    required
                  />
                  {getFieldError('password') && (
                    <p className="form-field error-text">{errors.password}</p>
                  )}
                </div>

                <div>
                  <button 
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="btn-primary w-full"
                  >
                    {isSubmitting || loading ? (
                      <ButtonLoading text="מתחבר..." />
                    ) : (
                      'התחבר'
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
                  אין לך חשבון?{' '}
                  <Link to="/register" className="font-medium text-accent hover:text-accentDark transition-colors">
                    הירשם עכשיו
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

export default Login
