import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { useApi } from '../hooks'
import { recommendationAPI } from '../services/api'
import { LoadingGrid, PageLayout, MovieGrid } from '../components'

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
    retryCount: 1
  })

  const handleLogout = () => {
    setLoading(true)
    logout()
  }

  const handleMovieClick = (imdbId) => {
    // Navigate to movie search with the selected movie
    window.open(`/search?movie=${imdbId}`, '_blank')
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
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-accent">סטטיסטיקות</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text/70">סרטים שצפית</span>
              <span className="text-accent font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text/70">רשימת צפייה</span>
              <span className="text-accent font-bold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text/70">דירוג ממוצע</span>
              <span className="text-accent font-bold">-</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-accent">פעילות אחרונה</h3>
          <div className="space-y-3">
            <div className="text-text/70 text-sm">
              אין פעילות אחרונה
            </div>
          </div>
        </div>
        
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
            <p className="text-text/70 text-center">
              לא ניתן לטעון המלצות כרגע
            </p>
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
          <button className="btn-secondary">
            היסטוריית צפייה
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Dashboard