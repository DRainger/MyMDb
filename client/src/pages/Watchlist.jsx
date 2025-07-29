import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks'
import { useApi } from '../hooks'
import { watchlistAPI } from '../services/api'
import { 
  PageLayout, 
  ErrorMessage, 
  EmptyState, 
  LoadingGrid, 
  MovieGrid 
} from '../components'

const Watchlist = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user's watchlist
  const { 
    data: watchlistData, 
    loading: watchlistLoading, 
    error: watchlistError,
    execute: fetchWatchlist 
  } = useApi(watchlistAPI.getWatchlist, {
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retryCount: 1
  })

  useEffect(() => {
    if (user) {
      fetchWatchlist()
    }
  }, [user, fetchWatchlist])

  useEffect(() => {
    if (watchlistData) {
      setWatchlist(watchlistData.watchlist || [])
      setLoading(false)
    }
  }, [watchlistData])

  useEffect(() => {
    if (watchlistError) {
      setError(watchlistError)
      setLoading(false)
    }
  }, [watchlistError])

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistAPI.removeFromWatchlist(movieId)
      setWatchlist(prev => prev.filter(movie => movie.movieId !== movieId))
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
    }
  }

  const handleClearWatchlist = async () => {
    try {
      await watchlistAPI.clearWatchlist()
      setWatchlist([])
    } catch (error) {
      console.error('Failed to clear watchlist:', error)
    }
  }

  if (loading || watchlistLoading) {
    return (
      <PageLayout>
        <LoadingGrid count={6} />
      </PageLayout>
    )
  }

  if (error || watchlistError) {
    return (
      <PageLayout>
        <ErrorMessage 
          message={`שגיאה בטעינת רשימת הצפייה: ${error || watchlistError}`}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent">
          רשימת צפייה
        </h1>
        {watchlist.length > 0 && (
          <button
            onClick={handleClearWatchlist}
            className="btn-secondary"
          >
            נקה רשימה
          </button>
        )}
      </div>

      {watchlist.length === 0 ? (
        <EmptyState
          icon="📋"
          title="רשימת הצפייה שלך ריקה"
          description="הוסף סרטים לרשימת הצפייה שלך כדי לראות אותם כאן"
          actionText="חפש סרטים"
          actionLink="/search"
        />
      ) : (
        <>
          <MovieGrid
            movies={watchlist}
            variant="watchlist"
            onRemove={handleRemoveFromWatchlist}
            user={user}
          />

          <div className="mt-8 text-center">
            <p className="text-text/70">
              {watchlist.length} סרטים ברשימת הצפייה שלך
            </p>
          </div>
        </>
      )}
    </PageLayout>
  )
}

export default Watchlist 