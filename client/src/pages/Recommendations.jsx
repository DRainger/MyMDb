import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks'
import { useApi } from '../hooks'
import { recommendationAPI } from '../services/api'
import { 
  PageLayout, 
  ErrorMessage, 
  EmptyState, 
  LoadingGrid, 
  MovieGrid,
  MovieCard 
} from '../components'

const Recommendations = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personalized')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Personalized recommendations (for logged-in users)
  const { 
    data: personalizedData, 
    loading: personalizedLoading, 
    error: personalizedError,
    execute: fetchPersonalized
  } = useApi(recommendationAPI.getUserRecommendations, {
    cacheTime: 15 * 60 * 1000, // 15 minutes cache
    retryCount: 1
  })

  // New user recommendations (for non-logged-in users)
  const { 
    data: newUserData, 
    loading: newUserLoading, 
    error: newUserError,
    execute: fetchNewUser
  } = useApi(recommendationAPI.getNewUserRecommendations, {
    cacheTime: 15 * 60 * 1000,
    retryCount: 1
  })

  // Trending movies
  const { 
    data: trendingData, 
    loading: trendingLoading, 
    error: trendingError,
    execute: fetchTrending
  } = useApi(recommendationAPI.getTrendingMovies, {
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
    retryCount: 1
  })

  // Popular movies
  const { 
    data: popularData, 
    loading: popularLoading, 
    error: popularError,
    execute: fetchPopular
  } = useApi(recommendationAPI.getPopularMovies, {
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    retryCount: 1
  })

  // Load recommendations based on active tab
  useEffect(() => {
    if (activeTab === 'personalized' && user) {
      fetchPersonalized({ limit: 12 })
    } else if (activeTab === 'new-user' && !user) {
      fetchNewUser({ limit: 12 })
    } else if (activeTab === 'trending') {
      fetchTrending({ limit: 8 })
    } else if (activeTab === 'popular') {
      fetchPopular({ limit: 10 })
    }
  }, [activeTab, user, fetchPersonalized, fetchNewUser, fetchTrending, fetchPopular])

  const handleMovieClick = async (imdbId) => {
    if (!imdbId) return

    setSelectedMovie(imdbId)
    setDetailsLoading(true)

    try {
      const response = await fetch(`/api/movies/${imdbId}`)
      if (response.ok) {
        const movieData = await response.json()
        setMovieDetails(movieData)
      }
    } catch (error) {
      console.error('Failed to fetch movie details:', error)
    } finally {
      setDetailsLoading(false)
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'personalized':
        return {
          data: personalizedData,
          loading: personalizedLoading,
          error: personalizedError,
          title: 'המלצות אישיות',
          description: 'סרטים מומלצים עבורך בהתבסס על הדירוגים שלך'
        }
      case 'new-user':
        return {
          data: newUserData,
          loading: newUserLoading,
          error: newUserError,
          title: 'המלצות למתחילים',
          description: 'סרטים מומלצים למשתמשים חדשים'
        }
      case 'trending':
        return {
          data: trendingData,
          loading: trendingLoading,
          error: trendingError,
          title: 'סרטים פופולריים',
          description: 'סרטים שזוכים להרבה דירוגים לאחרונה'
        }
      case 'popular':
        return {
          data: popularData,
          loading: popularLoading,
          error: popularError,
          title: 'סרטים פופולריים',
          description: 'הסרטים הפופולריים ביותר'
        }
      default:
        return {
          data: null,
          loading: false,
          error: null,
          title: '',
          description: ''
        }
    }
  }

  const currentData = getCurrentData()

  const tabs = [
    {
      id: 'personalized',
      label: 'המלצות אישיות',
      icon: '⭐',
      requiresAuth: true
    },
    {
      id: 'new-user',
      label: 'למתחילים',
      icon: '🆕',
      requiresAuth: false
    },
    {
      id: 'trending',
      label: 'טרנדים',
      icon: '📈',
      requiresAuth: false
    },
    {
      id: 'popular',
      label: 'פופולריים',
      icon: '🔥',
      requiresAuth: false
    }
  ]

  const renderTabs = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => {
          // Skip personalized tab if user is not logged in
          if (tab.requiresAuth && !user) return null
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-primary'
                  : 'bg-secondary text-text hover:bg-accent/20'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  const renderRecommendations = () => {
    if (currentData.loading) {
      return <LoadingGrid count={6} />
    }

    if (currentData.error) {
      return (
        <ErrorMessage 
          message={`שגיאה בטעינת המלצות: ${currentData.error}`}
        />
      )
    }

    const recommendations = currentData.data?.recommendations || []

    if (recommendations.length === 0) {
      return (
        <EmptyState
          icon="🎬"
          title="אין המלצות זמינות"
          description="נסה שוב מאוחר יותר או דרג כמה סרטים כדי לקבל המלצות אישיות"
          actionText="חזור לחיפוש"
          actionLink="/search"
        />
      )
    }

    return (
      <MovieGrid
        movies={recommendations}
        variant="search"
        onMovieClick={handleMovieClick}
        showWatchlistButton={true}
        user={user}
      />
    )
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
          המלצות סרטים
        </h1>
        <p className="text-text/80 text-lg">
          גלה סרטים חדשים ומומלצים עבורך
        </p>
      </div>

      {/* Tab Navigation */}
      {renderTabs()}

      {/* Current Tab Info */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-accent mb-2">
          {currentData.title}
        </h2>
        <p className="text-text/70">
          {currentData.description}
        </p>
        {currentData.data && (
          <p className="text-text/60 text-sm mt-2">
            נמצאו {currentData.data.count} המלצות
          </p>
        )}
      </div>

      {/* Recommendations Grid */}
      {renderRecommendations()}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-accent mb-4">
            פרטי הסרט
          </h3>
          
          {detailsLoading ? (
            <div className="card">
              <div className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="bg-accent/20 rounded-lg w-48 h-72"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-accent/20 rounded w-3/4"></div>
                    <div className="h-4 bg-accent/20 rounded w-1/2"></div>
                    <div className="h-4 bg-accent/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : movieDetails ? (
            <MovieCard
              movie={movieDetails}
              variant="detailed"
              user={user}
            />
          ) : (
            <ErrorMessage message="שגיאה בטעינת פרטי הסרט" />
          )}
        </div>
      )}

      {/* Help Section */}
      {!user && (
        <div className="mt-8">
          <div className="card bg-accent/5 border border-accent/20">
            <h3 className="text-lg font-semibold text-accent mb-2">
              💡 טיפ
            </h3>
            <p className="text-text/80">
              התחבר כדי לקבל המלצות אישיות בהתבסס על הדירוגים שלך!
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default Recommendations 