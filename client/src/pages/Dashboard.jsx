import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useApi } from '../hooks'
import { recommendationAPI, watchlistAPI, ratingAPI } from '../services/api'
import { LoadingGrid, PageLayout, MovieGrid, Loading, ErrorMessage } from '../components'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)

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
            <button className="w-full text-right text-text hover:text-accent transition-colors">
              שנה סיסמה
            </button>
            <button className="w-full text-right text-text hover:text-accent transition-colors">
              העדפות
            </button>
            <button className="w-full text-right text-text hover:text-accent transition-colors">
              היסטוריית צפייה
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
    </PageLayout>
  )
}

export default Dashboard