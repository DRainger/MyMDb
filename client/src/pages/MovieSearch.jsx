import React, { useState, useEffect } from 'react'
import { useApi, useDebounce, useAuth } from '../hooks'
import { watchlistAPI, movieAPI } from '../services/api'
import { 
  PageLayout, 
  ErrorMessage, 
  EmptyState, 
  LoadingGrid, 
  MovieGrid,
  MovieCard 
} from '../components'

const MovieSearch = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    type: 'movie',
    year: '',
    plot: 'short'
  })
  const [watchlistStatus, setWatchlistStatus] = useState({})
  const [hasSearched, setHasSearched] = useState(false)

  // Debounce the search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const debouncedFilters = useDebounce(filters, 300)

  // API hook for movie search
  const { 
    data: searchResults, 
    loading: searchLoading, 
    error: searchError, 
    execute: searchMovies 
  } = useApi(movieAPI.searchMovies, {
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
    retryCount: 2
  })

  // API hook for movie details
  const { 
    data: movieDetails, 
    loading: detailsLoading, 
    error: detailsError, 
    execute: getMovieDetails 
  } = useApi(movieAPI.getMovieById, {
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    retryCount: 1
  })

  // Search movies when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2) {
      setHasSearched(true)
      searchMovies({ query: debouncedSearchTerm })
    } else if (debouncedSearchTerm.trim().length === 0) {
      setHasSearched(false)
    }
  }, [debouncedSearchTerm, searchMovies])

  // Advanced search with filters
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2 && showAdvanced) {
      setHasSearched(true)
      searchMovies({ 
        query: debouncedSearchTerm,
        ...debouncedFilters
      })
    }
  }, [debouncedSearchTerm, debouncedFilters, showAdvanced, searchMovies])

  const handleMovieClick = async (imdbId) => {
    if (!imdbId) {
      return
    }

    setSelectedMovie(imdbId)
    await getMovieDetails({ imdbId })
    
    // Check if movie is in watchlist
    if (user) {
      try {
        const status = await watchlistAPI.checkMovieInWatchlist(imdbId)
        setWatchlistStatus(prev => ({
          ...prev,
          [imdbId]: status.isInWatchlist
        }))
      } catch (error) {
        console.error('Failed to check watchlist status:', error)
        // Set to false if check fails
        setWatchlistStatus(prev => ({
          ...prev,
          [imdbId]: false
        }))
      }
    }
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
      alert('הסרט נוסף לרשימת הצפייה!')
    } catch (error) {
      console.error('Failed to add to watchlist:', error)
      alert('שגיאה בהוספת הסרט לרשימת הצפייה')
    }
  }

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistAPI.removeFromWatchlist(movieId)
      setWatchlistStatus(prev => ({
        ...prev,
        [movieId]: false
      }))
      alert('הסרט הוסר מרשימת הצפייה!')
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
      alert('שגיאה בהסרת הסרט מרשימת הצפייה')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedMovie(null)
    setHasSearched(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim().length >= 2) {
      setHasSearched(true)
      searchMovies({ query: searchTerm.trim() })
    }
  }

  const renderSearchSuggestions = () => {
    const suggestions = [
      'Batman', 'Inception', 'The Dark Knight', 'Interstellar',
      'Breaking Bad', 'Game of Thrones', 'Stranger Things',
      'Marvel', 'Star Wars', 'Harry Potter'
    ]

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-accent mb-4">חיפושים מומלצים</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchTerm(suggestion)
                setHasSearched(true)
                searchMovies({ query: suggestion })
              }}
              className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm hover:bg-accent hover:text-primary transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-accent mb-4">
          חיפוש סרטים
        </h1>
        <p className="text-text/80 text-lg">
          חפש סרטים וסדרות במסד הנתונים של OMDB
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="הכנס שם סרט, שחקן או מילת מפתח..."
                className="input-field"
                minLength={2}
              />
            </div>
            <button
              type="submit"
              disabled={searchTerm.trim().length < 2}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              חפש
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-secondary whitespace-nowrap"
            >
              {showAdvanced ? 'הסתר' : 'חיפוש מתקדם'}
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-accent/20">
              <div>
                <label className="block text-sm font-medium text-accent mb-2">
                  סוג תוכן
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="input-field"
                >
                  <option value="movie">סרט</option>
                  <option value="series">סדרה</option>
                  <option value="episode">פרק</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-accent mb-2">
                  שנה
                </label>
                <input
                  type="number"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  placeholder="2024"
                  min="1900"
                  max="2030"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent mb-2">
                  אורך תקציר
                </label>
                <select
                  value={filters.plot}
                  onChange={(e) => handleFilterChange('plot', e.target.value)}
                  className="input-field"
                >
                  <option value="short">קצר</option>
                  <option value="full">מלא</option>
                </select>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Search Suggestions */}
      {!hasSearched && !searchLoading && (
        renderSearchSuggestions()
      )}

      {/* Search Results */}
      {searchLoading && (
        <LoadingGrid count={6} />
      )}

      {searchError && (
        <ErrorMessage message={`שגיאה בחיפוש: ${searchError}`} />
      )}

      {searchResults && searchResults.Search && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-accent">
              תוצאות חיפוש ({searchResults.totalResults || searchResults.Search.length})
            </h2>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-text/70 hover:text-accent transition-colors"
              >
                נקה חיפוש
              </button>
            )}
          </div>

          <MovieGrid
            movies={searchResults.Search}
            variant="search"
            onMovieClick={handleMovieClick}
            showWatchlistButton={true}
            watchlistStatus={watchlistStatus}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            user={user}
          />
        </div>
      )}

      {hasSearched && searchResults && searchResults.Search && searchResults.Search.length === 0 && (
        <EmptyState
          icon="🎬"
          title="לא נמצאו תוצאות"
          description="נסה לשנות את מילות החיפוש או להשתמש בחיפוש מתקדם"
          actionText="חזור לחיפושים מומלצים"
          onAction={() => setHasSearched(false)}
        />
      )}

      {/* Movie Details */}
      {selectedMovie && (
        <div>
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
          ) : detailsError ? (
            <ErrorMessage message={`שגיאה בטעינת פרטי סרט: ${detailsError}`} />
          ) : movieDetails ? (
            <MovieCard
              movie={movieDetails}
              variant="detailed"
              isInWatchlist={watchlistStatus[movieDetails.imdbID]}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              user={user}
            />
          ) : null}
        </div>
      )}
    </PageLayout>
  )
}

export default MovieSearch 