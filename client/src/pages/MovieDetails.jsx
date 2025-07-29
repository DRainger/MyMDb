import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { movieAPI, watchlistAPI, ratingAPI } from '../services/api'
import { 
  PageLayout, 
  ErrorMessage, 
  Loading, 
  RatingStars 
} from '../components'

const MovieDetails = () => {
  const { imdbId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState(null)
  const [averageRating, setAverageRating] = useState(null)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)

  useEffect(() => {
    if (imdbId) {
      loadMovieDetails()
    }
  }, [imdbId])

  useEffect(() => {
    if (movie && user) {
      checkWatchlistStatus()
      loadUserRating()
      loadAverageRating()
    }
  }, [movie, user])

  const loadMovieDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const movieData = await movieAPI.getMovieById({ imdbId })
      setMovie(movieData)
    } catch (err) {
      setError('שגיאה בטעינת פרטי הסרט')
      console.error('Failed to load movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkWatchlistStatus = async () => {
    try {
      const response = await watchlistAPI.checkMovieInWatchlist(imdbId)
      setIsInWatchlist(response.isInWatchlist)
    } catch (error) {
      console.error('Failed to check watchlist status:', error)
    }
  }

  const loadUserRating = async () => {
    try {
      const response = await ratingAPI.getUserRating(imdbId)
      setUserRating(response.rating)
    } catch (error) {
      console.error('Failed to load user rating:', error)
    }
  }

  const loadAverageRating = async () => {
    try {
      const response = await ratingAPI.getAverageRating(imdbId)
      setAverageRating(response)
    } catch (error) {
      console.error('Failed to load average rating:', error)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert('עליך להתחבר כדי להוסיף סרטים לרשימת הצפייה')
      return
    }

    try {
      setWatchlistLoading(true)
      await watchlistAPI.addToWatchlist(imdbId)
      setIsInWatchlist(true)
    } catch (error) {
      console.error('Failed to add to watchlist:', error)
      alert('שגיאה בהוספה לרשימת הצפייה')
    } finally {
      setWatchlistLoading(false)
    }
  }

  const handleRemoveFromWatchlist = async () => {
    if (!user) {
      alert('עליך להתחבר כדי להסיר סרטים מרשימת הצפייה')
      return
    }

    try {
      setWatchlistLoading(true)
      await watchlistAPI.removeFromWatchlist(imdbId)
      setIsInWatchlist(false)
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
      alert('שגיאה בהסרה מרשימת הצפייה')
    } finally {
      setWatchlistLoading(false)
    }
  }

  const handleRateMovie = async (rating) => {
    if (!user) {
      alert('עליך להתחבר כדי לדרג סרטים')
      return
    }

    try {
      setRatingLoading(true)
      await ratingAPI.rateMovie(imdbId, rating)
      setUserRating(rating)
      
      // Reload average rating
      await loadAverageRating()
    } catch (error) {
      console.error('Failed to rate movie:', error)
      alert('שגיאה בדירוג הסרט')
    } finally {
      setRatingLoading(false)
    }
  }

  const formatRuntime = (runtime) => {
    if (!runtime || runtime === 'N/A') return 'לא זמין'
    return runtime
  }

  const formatGenre = (genre) => {
    if (!genre || genre === 'N/A') return 'לא זמין'
    return genre.split(', ').join(' • ')
  }

  const formatActors = (actors) => {
    if (!actors || actors === 'N/A') return 'לא זמין'
    return actors.split(', ').join(', ')
  }

  const formatDirector = (director) => {
    if (!director || director === 'N/A') return 'לא זמין'
    return director
  }

  const formatWriter = (writer) => {
    if (!writer || writer === 'N/A') return 'לא זמין'
    return writer
  }

  const formatAwards = (awards) => {
    if (!awards || awards === 'N/A') return 'לא זמין'
    return awards
  }

  const formatBoxOffice = (boxOffice) => {
    if (!boxOffice || boxOffice === 'N/A') return 'לא זמין'
    return boxOffice
  }

  const formatProduction = (production) => {
    if (!production || production === 'N/A') return 'לא זמין'
    return production
  }

  const formatWebsite = (website) => {
    if (!website || website === 'N/A') return null
    return website
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading size="large" text="טוען פרטי סרט..." />
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorMessage message={error} />
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary"
          >
            חזור
          </button>
        </div>
      </PageLayout>
    )
  }

  if (!movie) {
    return (
      <PageLayout>
        <ErrorMessage message="הסרט לא נמצא" />
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary"
          >
            חזור
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Back button clicked')
            
            try {
              // Try React Router navigation first
              if (window.history.length > 1) {
                console.log('Navigating back with React Router')
                navigate(-1)
              } else {
                console.log('Navigating to home')
                navigate('/')
              }
            } catch (error) {
              console.log('Using browser back as fallback')
              // Fallback to browser back
              window.history.back()
            }
          }}
          className="mb-6 btn-secondary flex items-center gap-2 hover:bg-accent/20 transition-colors cursor-pointer select-none"
          type="button"
        >
          <span>←</span>
          <span>חזור</span>
        </button>

        {/* Movie Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.svg'}
                alt={movie.Title}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-movie.svg'
                }}
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">
                {movie.Title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-text/80">
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  {movie.Year}
                </span>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  {movie.Type === 'movie' ? 'סרט' : movie.Type === 'series' ? 'סדרה' : 'פרק'}
                </span>
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                  {formatRuntime(movie.Runtime)}
                </span>
                {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                    {movie.Rated}
                  </span>
                )}
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-2">דירוג ממוצע</h3>
                    {averageRating ? (
                      <div className="flex items-center gap-2">
                        <RatingStars rating={averageRating.average} size="medium" />
                        <span className="text-text/70">
                          ({averageRating.average}/5) - {averageRating.count} דירוגים
                        </span>
                      </div>
                    ) : (
                      <span className="text-text/70">אין דירוגים עדיין</span>
                    )}
                  </div>
                </div>

                {user && (
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-2">הדירוג שלך</h3>
                    <RatingStars 
                      rating={userRating || 0}
                      onRate={handleRateMovie}
                      interactive={true}
                      size="medium"
                    />
                    {ratingLoading && <span className="text-text/70 mr-2">טוען...</span>}
                  </div>
                )}
              </div>

              {/* Watchlist Button */}
              {user && (
                <div className="mb-6">
                  {isInWatchlist ? (
                    <button
                      onClick={handleRemoveFromWatchlist}
                      disabled={watchlistLoading}
                      className="btn-secondary"
                    >
                      {watchlistLoading ? 'מסיר...' : 'הסר מרשימת הצפייה'}
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToWatchlist}
                      disabled={watchlistLoading}
                      className="btn-primary"
                    >
                      {watchlistLoading ? 'מוסיף...' : 'הוסף לרשימת הצפייה'}
                    </button>
                  )}
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-accent mb-3">תקציר הסרט</h3>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                    <p className="text-text leading-relaxed text-base">{movie.Plot}</p>
                  </div>
                </div>
              )}

              {/* IMDb Rating */}
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-accent mb-2">דירוג IMDb</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-accent">⭐</span>
                      <span className="text-2xl font-bold text-accent">{movie.imdbRating}</span>
                      <span className="text-text/70 text-lg">/10</span>
                    </div>
                    {movie.imdbVotes && (
                      <span className="text-text/70 text-sm">
                        ({movie.imdbVotes} קולות)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Cast & Crew */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-accent mb-4">שחקנים וצוות</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-text mb-2">שחקנים</h4>
                  <p className="text-text/80">{formatActors(movie.Actors)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-text mb-2">במאי</h4>
                  <p className="text-text/80">{formatDirector(movie.Director)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-text mb-2">תסריטאי</h4>
                  <p className="text-text/80">{formatWriter(movie.Writer)}</p>
                </div>
              </div>
            </div>

            {/* Awards */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-accent mb-4">פרסים</h3>
                <p className="text-text/80">{formatAwards(movie.Awards)}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Technical Details */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-accent mb-4">פרטים טכניים</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-text">ז'אנר</span>
                  <span className="text-text/80">{formatGenre(movie.Genre)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-text">שפה</span>
                  <span className="text-text/80">{movie.Language !== 'N/A' ? movie.Language : 'לא זמין'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-text">מדינה</span>
                  <span className="text-text/80">{movie.Country !== 'N/A' ? movie.Country : 'לא זמין'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-text">תאריך יציאה</span>
                  <span className="text-text/80">{movie.Released !== 'N/A' ? movie.Released : 'לא זמין'}</span>
                </div>
                
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-text">הכנסות</span>
                    <span className="text-text/80">{formatBoxOffice(movie.BoxOffice)}</span>
                  </div>
                )}
                
                {movie.Production && movie.Production !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-text">הפקה</span>
                    <span className="text-text/80">{formatProduction(movie.Production)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ratings */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-accent mb-4">דירוגים</h3>
              
              <div className="space-y-3">
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text">IMDb</span>
                    <div className="flex items-center gap-2">
                      <span className="text-accent">★</span>
                      <span className="text-text/80">{movie.imdbRating}/10</span>
                    </div>
                  </div>
                )}
                
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text">Metascore</span>
                    <span className="text-text/80">{movie.Metascore}/100</span>
                  </div>
                )}
              </div>
            </div>

            {/* Website */}
            {formatWebsite(movie.Website) && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-accent mb-4">אתר רשמי</h3>
                <a 
                  href={movie.Website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accentDark transition-colors"
                >
                  {movie.Website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default MovieDetails 