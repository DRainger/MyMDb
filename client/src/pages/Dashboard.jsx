import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useApi, useForm } from '../hooks'
import { recommendationAPI, watchlistAPI, ratingAPI, userAPI } from '../services/api'
import { LoadingGrid, PageLayout, MovieGrid, Loading, ErrorMessage } from '../components'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  
  // Change password modal state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const [changePasswordError, setChangePasswordError] = useState('')
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('')

  // Change password form
  const { 
    values: passwordValues, 
    errors: passwordErrors, 
    handleChange: handlePasswordChange, 
    handleSubmit: handlePasswordSubmit,
    resetForm: resetPasswordForm,
    setValues: setPasswordValues
  } = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }, {
    currentPassword: [
      (value) => !value ? 'סיסמה נוכחית נדרשת' : null
    ],
    newPassword: [
      (value) => !value ? 'סיסמה חדשה נדרשת' : null,
      (value) => value && value.length < 6 ? 'סיסמה חדשה חייבת להיות לפחות 6 תווים' : null
    ],
    confirmPassword: [
      (value) => !value ? 'אישור סיסמה נדרש' : null,
      (value) => value && value !== passwordValues.newPassword ? 'הסיסמאות אינן תואמות' : null
    ]
  })

  // Handle change password
  const handleChangePassword = async (formData) => {
    try {
      setChangePasswordLoading(true)
      setChangePasswordError('')
      setChangePasswordSuccess('')
      
      const result = await userAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      
      setChangePasswordSuccess('הסיסמה שונתה בהצלחה!')
      resetPasswordForm()
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowChangePasswordModal(false)
        setChangePasswordSuccess('')
      }, 2000)
      
    } catch (error) {
      setChangePasswordError(error.message || 'שגיאה בשינוי הסיסמה')
    } finally {
      setChangePasswordLoading(false)
    }
  }

  const openChangePasswordModal = () => {
    setShowChangePasswordModal(true)
    setChangePasswordError('')
    setChangePasswordSuccess('')
    resetPasswordForm()
  }

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false)
    setChangePasswordError('')
    setChangePasswordSuccess('')
    resetPasswordForm()
  }

  // Fetch personalized recommendations
  const { 
    data: recommendationsData, 
    loading: recommendationsLoading, 
    error: recommendationsError,
    execute: fetchRecommendations
  } = useApi(recommendationAPI.getUserRecommendations, {
    cacheTime: 15 * 60 * 1000, // 15 minutes cache
    retryCount: 1,
    onError: (error) => {
      console.error('Recommendations API error:', error)
    }
  })

  // Fetch watchlist count
  const {
    data: watchlistCountData,
    loading: watchlistCountLoading,
    error: watchlistCountError,
    execute: fetchWatchlistCount
  } = useApi(watchlistAPI.getWatchlistCount, {
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retryCount: 1,
    onError: (error) => {
      console.error('Watchlist count API error:', error)
    }
  })

  // Fetch user rating stats
  const {
    data: ratingStatsData,
    loading: ratingStatsLoading,
    error: ratingStatsError,
    execute: fetchRatingStats
  } = useApi(ratingAPI.getUserRatingStats, {
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retryCount: 1,
    onError: (error) => {
      console.error('Rating stats API error:', error)
    }
  })

  // Fetch recent ratings
  const {
    data: recentRatingsData,
    loading: recentRatingsLoading,
    error: recentRatingsError,
    execute: fetchRecentRatings
  } = useApi(ratingAPI.getRecentRatings, {
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retryCount: 1,
    onError: (error) => {
      console.error('Recent ratings API error:', error)
    }
  })

  // Load data when component mounts
  useEffect(() => {
    if (user) {
      // Execute API calls
      const loadData = async () => {
        try {
          await fetchWatchlistCount()
          await fetchRatingStats()
          await fetchRecentRatings({ limit: 3 })
          await fetchRecommendations({ limit: 8 })
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        }
      }
      
      loadData()
    }
  }, [user, fetchWatchlistCount, fetchRatingStats, fetchRecentRatings, fetchRecommendations])

  const handleLogout = () => {
    setLoading(true)
    logout()
  }

  const handleMovieClick = (imdbId) => {
    // Navigate to movie details page in the same tab
    window.location.href = `/movie/${imdbId}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAverageRating = () => {
    if (!ratingStatsData || !ratingStatsData.totalRatings) return '-'
    return (ratingStatsData.averageRating || 0).toFixed(1)
  }


  const getWatchlistCount = () => {
    return watchlistCountData?.count || 0
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent">
          לוח בקרה
        </h1>
        <button 
          onClick={handleLogout}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? 'יוצא...' : 'התנתק'}
        </button>
      </div>
      
      {user && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-2 text-accent">
            שלום {user.name}!
          </h2>
          <p className="text-text/70">
            ברוך הבא לאזור האישי שלך
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Statistics Card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-accent">סטטיסטיקות</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text/70">סרטים ברשימת צפייה</span>
              {watchlistCountLoading ? (
                <Loading size="small" />
              ) : watchlistCountError ? (
                <span className="text-red-400 text-sm">שגיאה</span>
              ) : (
                <span className="text-accent font-bold">{getWatchlistCount()}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text/70">סרטים שדירגת</span>
              {ratingStatsLoading ? (
                <Loading size="small" />
              ) : ratingStatsError ? (
                <span className="text-red-400 text-sm">שגיאה</span>
              ) : (
                <span className="text-accent font-bold">{ratingStatsData?.totalRatings || 0}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text/70">דירוג ממוצע שלך</span>
              {ratingStatsLoading ? (
                <Loading size="small" />
              ) : ratingStatsError ? (
                <span className="text-red-400 text-sm">שגיאה</span>
              ) : (
                <span className="text-accent font-bold">{getAverageRating()}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Activity Card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-accent">פעילות אחרונה</h3>
          <div className="space-y-3">
            {recentRatingsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-text/20 rounded h-4 w-3/4"></div>
                    <div className="bg-text/10 rounded h-3 w-1/2 mt-1"></div>
                  </div>
                ))}
              </div>
            ) : recentRatingsError ? (
              <div className="text-text/70 text-sm">
                לא ניתן לטעון פעילות אחרונה
                <button 
                  onClick={() => fetchRecentRatings({ limit: 3 })}
                  className="block mt-2 text-accent hover:text-accentDark text-xs"
                >
                  נסה שוב
                </button>
              </div>
            ) : recentRatingsData?.ratings?.length > 0 ? (
              (() => {
                return recentRatingsData.ratings.slice(0, 3).map((rating, index) => (
                  <div key={index} className="border-b border-accent/10 pb-2 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-text font-medium text-sm truncate">
                          {rating.movieTitle || 'סרט לא ידוע'}
                        </p>
                        <p className="text-text/70 text-xs">
                          {formatDate(rating.ratedAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-accent font-bold text-sm">{rating.rating}</span>
                        <span className="text-accent">⭐</span>
                      </div>
                    </div>
                  </div>
                ))
              })()
            ) : (
              <div className="text-text/70 text-sm">
                אין פעילות אחרונה
                <p className="text-xs mt-1">
                  דרג סרטים כדי לראות פעילות כאן
                </p>
                <Link 
                  to="/search" 
                  className="block mt-2 text-accent hover:text-accentDark text-xs font-medium"
                >
                  חפש סרטים לדירוג →
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Settings Card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-accent">הגדרות</h3>
          <div className="space-y-3">
            <Link to="/profile" className="w-full text-right text-text hover:text-accent transition-colors block">
              ערוך פרופיל
            </Link>
            <button 
              onClick={openChangePasswordModal}
              className="w-full text-right text-text hover:text-accent transition-colors"
            >
              שנה סיסמה
            </button>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-accent">המלצות אישיות</h2>
          <Link to="/recommendations" className="text-accent hover:text-accentDark text-sm font-medium transition-colors">
            צפה בכל ההמלצות →
          </Link>
        </div>
        
        {recommendationsLoading ? (
          <LoadingGrid count={4} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
        ) : recommendationsError ? (
          <div className="card">
            <ErrorMessage message="לא ניתן לטעון המלצות כרגע" />
            <button 
              onClick={() => fetchRecommendations({ limit: 8 })}
              className="btn-secondary mt-4 mx-auto block"
            >
              נסה שוב
            </button>
          </div>
        ) : recommendationsData?.recommendations?.length > 0 ? (
          <MovieGrid
            movies={recommendationsData.recommendations.slice(0, 4)}
            variant="search"
            onMovieClick={handleMovieClick}
            showWatchlistButton={true}
            user={user}
            columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          />
        ) : (
          <div className="card text-center">
            <p className="text-text/70 mb-4">
              דרג כמה סרטים כדי לקבל המלצות אישיות
            </p>
            <Link to="/search" className="btn-primary">
              חפש סרטים
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-accent">פעולות מהירות</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/search" className="btn-primary text-center">
            חיפוש סרטים
          </Link>
          <Link to="/watchlist" className="btn-secondary text-center">
            רשימת צפייה
          </Link>
          <Link to="/recommendations" className="btn-secondary text-center">
            המלצות
          </Link>
          <Link to="/movies" className="btn-secondary text-center">
            גלה סרטים חדשים
          </Link>
        </div>
      </div>

      {/* Error Handling for API Failures */}
      {(watchlistCountError || ratingStatsError || recentRatingsError) && (
        <div className="mt-6">
          <ErrorMessage 
            message="חלק מהנתונים לא נטענו כראוי. רענן את הדף או נסה שוב מאוחר יותר." 
            variant="warning"
          />
          <div className="mt-4 space-y-2">
            {watchlistCountError && (
              <button 
                onClick={() => fetchWatchlistCount()}
                className="btn-secondary text-sm"
              >
                נסה לטעון סטטיסטיקות רשימת צפייה
              </button>
            )}
            {ratingStatsError && (
              <button 
                onClick={() => fetchRatingStats()}
                className="btn-secondary text-sm"
              >
                נסה לטעון סטטיסטיקות דירוגים
              </button>
            )}
            {recentRatingsError && (
              <button 
                onClick={() => fetchRecentRatings({ limit: 3 })}
                className="btn-secondary text-sm"
              >
                נסה לטעון פעילות אחרונה
              </button>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-accent">שנה סיסמה</h3>
              <button
                onClick={closeChangePasswordModal}
                className="text-text/70 hover:text-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handlePasswordSubmit(handleChangePassword)
            }}>
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    סיסמה נוכחית
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-field w-full"
                    placeholder="הכנס סיסמה נוכחית"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field w-full"
                    placeholder="הכנס סיסמה חדשה"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    אישור סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-field w-full"
                    placeholder="אישור סיסמה חדשה"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Error Message */}
                {changePasswordError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
                    {changePasswordError}
                  </div>
                )}

                {/* Success Message */}
                {changePasswordSuccess && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg">
                    {changePasswordSuccess}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeChangePasswordModal}
                    className="btn-secondary flex-1"
                    disabled={changePasswordLoading}
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={changePasswordLoading}
                  >
                    {changePasswordLoading ? 'משנה סיסמה...' : 'שנה סיסמה'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default Dashboard