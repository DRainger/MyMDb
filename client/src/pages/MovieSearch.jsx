import React, { useState, useEffect } from 'react'
import { useApi, useDebounce } from '../hooks'
import { movieAPI } from '../services/api'
import { CardLoading, SkeletonLoading } from '../components/Loading'

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    type: 'movie',
    year: '',
    plot: 'short'
  })

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
      searchMovies({ query: debouncedSearchTerm })
    }
  }, [debouncedSearchTerm, searchMovies])

  // Advanced search with filters
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2 && showAdvanced) {
      searchMovies({ 
        query: debouncedSearchTerm,
        ...debouncedFilters
      })
    }
  }, [debouncedSearchTerm, debouncedFilters, showAdvanced, searchMovies])

  const handleMovieClick = async (imdbId) => {
    setSelectedMovie(imdbId)
    await getMovieDetails({ imdbId })
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
  }

  const renderMovieCard = (movie) => (
    <div 
      key={movie.imdbID}
      onClick={() => handleMovieClick(movie.imdbID)}
      className="card cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-start space-x-4">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'} 
          alt={movie.Title}
          className="w-16 h-24 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = '/placeholder-movie.jpg'
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-accent mb-1 truncate">
            {movie.Title}
          </h3>
          <p className="text-text/70 text-sm mb-2">
            {movie.Year} • {movie.Type === 'movie' ? 'סרט' : movie.Type === 'series' ? 'סדרה' : 'תוכנית'}
          </p>
          {movie.imdbID && (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-accent text-primary px-2 py-1 rounded">
                IMDB: {movie.imdbID}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderMovieDetails = () => {
    if (!movieDetails) return null

    return (
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <img 
              src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : '/placeholder-movie.jpg'} 
              alt={movieDetails.Title}
              className="w-48 h-72 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg'
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-accent mb-2">
              {movieDetails.Title}
            </h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-text/70">{movieDetails.Year}</span>
              <span className="text-text/70">{movieDetails.Runtime}</span>
              <span className="text-text/70">{movieDetails.Rated}</span>
            </div>
            
            {movieDetails.imdbRating && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-accent font-bold">⭐ {movieDetails.imdbRating}/10</span>
                <span className="text-text/70">({movieDetails.imdbVotes} votes)</span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-accent mb-2">תקציר</h3>
              <p className="text-text/80 leading-relaxed">
                {movieDetails.Plot}
              </p>
            </div>

            {movieDetails.Genre && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-accent mb-2">ז'אנר</h3>
                <div className="flex flex-wrap gap-2">
                  {movieDetails.Genre.split(', ').map(genre => (
                    <span key={genre} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movieDetails.Director && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-accent mb-2">בימוי</h3>
                <p className="text-text/80">{movieDetails.Director}</p>
              </div>
            )}

            {movieDetails.Actors && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-accent mb-2">שחקנים</h3>
                <p className="text-text/80">{movieDetails.Actors}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button className="btn-primary">
                הוסף לרשימת צפייה
              </button>
              <button className="btn-secondary">
                שמור למועדפים
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      <div className="main-container py-6 md:py-10">
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
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="הכנס שם סרט, שחקן או מילת מפתח..."
                  className="input-field"
                />
              </div>
              <button
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
          </div>
        </div>

        {/* Search Results */}
        {searchLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonLoading key={i} />
            ))}
          </div>
        )}

        {searchError && (
          <div className="error-message">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>שגיאה בחיפוש: {searchError}</span>
            </div>
          </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.Search.map(renderMovieCard)}
            </div>
          </div>
        )}

        {searchResults && searchResults.Search && searchResults.Search.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-accent mb-2">
              לא נמצאו תוצאות
            </h3>
            <p className="text-text/70">
              נסה לשנות את מילות החיפוש או להשתמש בחיפוש מתקדם
            </p>
          </div>
        )}

        {/* Movie Details */}
        {selectedMovie && (
          <div>
            {detailsLoading ? (
              <CardLoading text="טוען פרטי סרט..." />
            ) : detailsError ? (
              <div className="error-message">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>שגיאה בטעינת פרטי סרט: {detailsError}</span>
                </div>
              </div>
            ) : (
              renderMovieDetails()
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieSearch 