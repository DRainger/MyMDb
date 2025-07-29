import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useAuth } from '../hooks'
import { ButtonLoading, ErrorMessage, PageLayout } from '../components'

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
    <PageLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
              יצירת חשבון חדש
            </h1>
            <p className="text-text/80 text-base">
              צור חשבון חדש כדי להתחיל להשתמש באפליקציה
            </p>
          </div>
          
          <div className="form-container">
            {error && (
              <ErrorMessage message={error} className="mb-6" />
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
                  placeholder="הכנס את שמך המלא"
                />
                {getFieldError('name') && (
                  <div className="error-text">{getFieldError('name')}</div>
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
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input-field ${getFieldError('password') ? 'error' : ''}`}
                  placeholder="הכנס סיסמה חזקה"
                />
                {values.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.bg}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${strengthInfo.color}`}>
                        {strengthInfo.text}
                      </span>
                    </div>
                  </div>
                )}
                {getFieldError('password') && (
                  <div className="error-text">{getFieldError('password')}</div>
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
                  placeholder="הכנס שוב את הסיסמה"
                />
                {getFieldError('confirmPassword') && (
                  <div className="error-text">{getFieldError('confirmPassword')}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-primary w-full"
              >
                {isSubmitting || loading ? (
                  <ButtonLoading text="יוצר חשבון..." />
                ) : (
                  'צור חשבון'
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
                כבר יש לך חשבון?
              </p>
              <Link 
                to="/login" 
                className="btn-secondary w-full"
              >
                התחבר לחשבון קיים
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Register