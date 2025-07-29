import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useAuth } from '../hooks'
import { ButtonLoading, ErrorMessage, PageLayout } from '../components'

const Profile = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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
    getFieldError,
    setValues
  } = useForm({
    name: user?.name || '',
    email: user?.email || ''
  }, validationRules)

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user, setValues])

  const handleEditProfile = async (formData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('הפרופיל עודכן בהצלחה!')
      setLoading(false)
    } catch (err) {
      setError('שגיאה בעדכון הפרופיל')
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    await handleSubmit(handleEditProfile)
  }

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-accent mb-4">לא נמצא משתמש</h1>
          <p className="text-text/70 mb-8">עליך להתחבר כדי לצפות בפרופיל שלך</p>
          <Link to="/login" className="btn-primary">
            התחברות
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent">
            הפרופיל שלי
          </h1>
          <button 
            onClick={handleLogout}
            className="btn-secondary"
          >
            התנתק
          </button>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-2 text-accent">
            שלום {user.name}!
          </h2>
          <p className="text-text/70">
            כאן תוכל לערוך את פרטי החשבון שלך
          </p>
        </div>

        <div className="form-container">
          {error && (
            <ErrorMessage message={error} className="mb-6" />
          )}

          {success && (
            <div className="success-message mb-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{success}</span>
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

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-primary flex-1"
              >
                {isSubmitting || loading ? (
                  <ButtonLoading text="מעדכן..." />
                ) : (
                  'עדכן פרופיל'
                )}
              </button>
              
              <Link to="/dashboard" className="btn-secondary flex-1 text-center">
                חזור ללוח בקרה
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-accent">פעולות נוספות</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/watchlist" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-accent">רשימת צפייה</h4>
              <p className="text-text/70 text-sm">ניהול רשימת הצפייה שלך</p>
            </Link>
            
            <Link to="/search" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-semibold text-accent">חיפוש סרטים</h4>
              <p className="text-text/70 text-sm">חפש סרטים וסדרות חדשים</p>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Profile 