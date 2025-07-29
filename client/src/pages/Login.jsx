import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useAuth } from '../hooks'
import { ButtonLoading, ErrorMessage, PageLayout } from '../components'

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
    <PageLayout>
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
              <ErrorMessage message={error} className="mb-6" />
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
                  placeholder="הכנס כתובת אימייל"
                />
                {getFieldError('email') && (
                  <div className="error-text">{getFieldError('email')}</div>
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
                  placeholder="הכנס סיסמה"
                />
                {getFieldError('password') && (
                  <div className="error-text">{getFieldError('password')}</div>
                )}
              </div>

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
            </form>

            <div className="divider">
              <div className="divider-text">
                <span>או</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-text/70 mb-4">
                אין לך חשבון?
              </p>
              <Link 
                to="/register" 
                className="btn-secondary w-full"
              >
                צור חשבון חדש
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Login
