import React, { useState, useEffect } from 'react'
import { useAuth, useApi } from '../hooks'
import { movieAPI, watchlistAPI } from '../services/api'
import { 
  PageLayout, 
  ErrorMessage, 
  EmptyState, 
  LoadingGrid, 
  MovieGrid 
} from '../components'

const AllMovies = () => {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [watchlistStatus, setWatchlistStatus] = useState({})

  // Generate random search terms for variety
  const generateRandomQueries = () => {
    const randomWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'action', 'drama', 'comedy', 'horror', 'thriller', 'romance', 'sci-fi', 'fantasy', 'mystery',
      'adventure', 'crime', 'war', 'western', 'musical', 'documentary', 'animation', 'family',
      'love', 'life', 'death', 'time', 'space', 'world', 'city', 'country', 'home', 'family',
      'friend', 'enemy', 'hero', 'villain', 'king', 'queen', 'prince', 'princess', 'warrior',
      'magic', 'power', 'money', 'freedom', 'justice', 'revenge', 'betrayal', 'loyalty', 'courage',
      'fear', 'hope', 'dream', 'nightmare', 'reality', 'fantasy', 'truth', 'lie', 'secret', 'mystery'
    ]

    const randomQueries = []
    for (let i = 0; i < 15; i++) {
      // Generate random 1-3 word combinations
      const wordCount = Math.floor(Math.random() * 3) + 1
      const query = []
      
      for (let j = 0; j < wordCount; j++) {
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)]
        query.push(randomWord)
      }
      
      randomQueries.push(query.join(' '))
    }

    return randomQueries
  }

  const loadMovies = async () => {
    try {
      setLoading(true)
      setError(null)

      const allMovies = []
      const seenIds = new Set()

      // Generate random queries for this load
      const randomQueries = generateRandomQueries()

      // Load movies from random queries
      for (const query of randomQueries) {
        try {
          const result = await movieAPI.searchMovies({ query })
          if (result.Search) {
            // Add movies that we haven't seen before
            result.Search.forEach(movie => {
              if (!seenIds.has(movie.imdbID)) {
                seenIds.add(movie.imdbID)
                allMovies.push(movie)
              }
            })
          }
        } catch (err) {
          console.warn(`Failed to load movies for query: ${query}`, err)
        }
      }

      // Shuffle the movies to get a truly random selection
      const shuffledMovies = allMovies.sort(() => Math.random() - 0.5)
      
      setMovies(shuffledMovies.slice(0, 20))
      setHasMore(shuffledMovies.length > 20)
      setLoading(false)
    } catch (err) {
      setError('שגיאה בטעינת הסרטים')
      setLoading(false)
    }
  }

  // Check watchlist status for all movies
  const checkWatchlistStatus = async (movieIds) => {
    if (!user) return

    try {
      const statusPromises = movieIds.map(async (movieId) => {
        try {
          const response = await watchlistAPI.checkMovieInWatchlist(movieId)
          return { movieId, isInWatchlist: response.isInWatchlist }
        } catch (error) {
          console.error(`Failed to check watchlist status for ${movieId}:`, error)
          return { movieId, isInWatchlist: false }
        }
      })

      const statuses = await Promise.all(statusPromises)
      const statusMap = {}
      statuses.forEach(({ movieId, isInWatchlist }) => {
        statusMap[movieId] = isInWatchlist
      })
      setWatchlistStatus(statusMap)
    } catch (error) {
      console.error('Failed to check watchlist statuses:', error)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  // Check watchlist status when movies or user changes
  useEffect(() => {
    if (movies.length > 0 && user) {
      const movieIds = movies.map(movie => movie.imdbID)
      checkWatchlistStatus(movieIds)
    }
  }, [movies, user])

  const handleMovieClick = async (imdbId) => {
    // Navigate to movie details page in the same tab
    window.location.href = `/movie/${imdbId}`
  }

  const handleAddToWatchlist = async (movieId) => {
    if (!user) {
      alert('עליך להתחבר כדי להוסיף סרטים לרשימת הצפייה')
      return
    }

    try {
      await watchlistAPI.addToWatchlist(movieId)
      setWatchlistStatus(prev => ({
        ...prev,
        [movieId]: true
      }))
    } catch (error) {
      console.error('Failed to add to watchlist:', error)
      alert('שגיאה בהוספה לרשימת הצפייה')
    }
  }

  const handleRemoveFromWatchlist = async (movieId) => {
    if (!user) {
      alert('עליך להתחבר כדי להסיר סרטים מרשימת הצפייה')
      return
    }

    try {
      await watchlistAPI.removeFromWatchlist(movieId)
      setWatchlistStatus(prev => ({
        ...prev,
        [movieId]: false
      }))
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
      alert('שגיאה בהסרה מרשימת הצפייה')
    }
  }

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
    // Load more with different random queries
    loadMovies()
  }

  const handleRetry = () => {
    loadMovies()
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
            גלה סרטים חדשים
          </h1>
          <p className="text-text/80 text-lg">
            אוסף מגוון של סרטים וסדרות לגילוי
          </p>
        </div>
        <LoadingGrid count={8} />
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
            גלה סרטים חדשים
          </h1>
          <p className="text-text/80 text-lg">
            אוסף מגוון של סרטים וסדרות לגילוי
          </p>
        </div>
        <ErrorMessage message={error} />
        <div className="text-center mt-6">
          <button onClick={handleRetry} className="btn-primary">
            נסה שוב
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
          גלה סרטים חדשים
        </h1>
        <p className="text-text/80 text-lg">
          אוסף מגוון של סרטים וסדרות לגילוי
        </p>
      </div>

      {movies.length === 0 ? (
        <EmptyState
          icon="🎬"
          title="לא נמצאו סרטים"
          description="לא ניתן לטעון סרטים כרגע"
          actionText="נסה שוב"
          onAction={handleRetry}
        />
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-accent">
              סרטים לגילוי
            </h2>
            <p className="text-text/70 text-sm mt-1">
              אוסף מגוון של סרטים וסדרות לגילוי
            </p>
          </div>

          <MovieGrid
            movies={movies}
            variant="search"
            onMovieClick={handleMovieClick}
            showWatchlistButton={true}
            watchlistStatus={watchlistStatus}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            user={user}
            columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            className="mb-8"
          />

          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="btn-primary"
              >
                טען עוד סרטים לגילוי
              </button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}

export default AllMovies 