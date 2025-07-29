import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks'
import { ratingAPI } from '../services/api'
import RatingStars from './RatingStars'

const MovieCard = ({ 
  movie, 
  variant = 'search', // 'search', 'watchlist', 'detailed'
  onClick, 
  onRemove,
  showWatchlistButton = false,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  user = null,
  className = ''
}) => {
  const { user: authUser } = useAuth()
  const [userRating, setUserRating] = useState(0)
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 })
  const [ratingLoading, setRatingLoading] = useState(false)

  // Load user's rating and average rating for this movie
  useEffect(() => {
    const loadRatings = async () => {
      if (!movie.imdbID) return

      try {
        setRatingLoading(true)
        
        // Load user's rating if logged in
        if (authUser) {
          try {
            const userRatingData = await ratingAPI.getUserRating(movie.imdbID)
            setUserRating(userRatingData.rating || 0)
          } catch (error) {
            console.error('Failed to load user rating:', error)
          }
        }

        // Load average rating
        try {
          const avgRatingData = await ratingAPI.getAverageRating(movie.imdbID)
          setAverageRating(avgRatingData)
        } catch (error) {
          console.error('Failed to load average rating:', error)
        }
      } finally {
        setRatingLoading(false)
      }
    }

    loadRatings()
  }, [movie.imdbID, authUser])

  const handleRateMovie = async (rating) => {
    if (!authUser) {
      alert('עליך להתחבר כדי לדרג סרטים')
      return
    }

    if (!movie.imdbID) {
      alert('לא ניתן לדרג סרט זה')
      return
    }

    try {
      setRatingLoading(true)
      await ratingAPI.rateMovie(movie.imdbID, rating)
      setUserRating(rating)
      
      // Reload average rating
      const avgRatingData = await ratingAPI.getAverageRating(movie.imdbID)
      setAverageRating(avgRatingData)
      
      alert(rating === userRating ? 'הדירוג עודכן בהצלחה!' : 'הדירוג נוסף בהצלחה!')
    } catch (error) {
      console.error('Failed to rate movie:', error)
      alert('שגיאה בדירוג הסרט')
    } finally {
      setRatingLoading(false)
    }
  }

  const handleCardClick = () => {
    if (onClick && movie.imdbID) {
      onClick(movie.imdbID)
    }
  }

  const handleRemoveClick = (e) => {
    e.stopPropagation()
    if (onRemove && movie.movieId) {
      onRemove(movie.movieId)
    }
  }

  const handleWatchlistClick = (e) => {
    e.stopPropagation()
    if (!user) {
      alert('עליך להתחבר כדי להוסיף סרטים לרשימת הצפייה')
      return
    }

    if (isInWatchlist) {
      onRemoveFromWatchlist?.(movie.imdbID || movie.movieId)
    } else {
      onAddToWatchlist?.(movie.imdbID || movie.movieId)
    }
  }

  const getMovieTitle = () => {
    return movie.Title || movie.title || 'Unknown Title'
  }

  const getMovieYear = () => {
    return movie.Year || movie.year || 'N/A'
  }

  const getMovieType = () => {
    const type = movie.Type || movie.type || 'movie'
    return type === 'movie' ? 'סרט' : type === 'series' ? 'סדרה' : 'תוכנית'
  }

  const getMoviePoster = () => {
    const poster = movie.Poster || movie.poster
    return poster && poster !== 'N/A' ? poster : '/placeholder-movie.svg'
  }

  const getMovieRating = () => {
    return movie.imdbRating || movie.rating
  }

  // Search/List variant (compact)
  if (variant === 'search' || variant === 'watchlist') {
    return (
      <div 
        className={`card cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105 ${className}`}
        onClick={handleCardClick}
      >
        <div className="flex items-start space-x-4">
          <img 
            src={getMoviePoster()} 
            alt={getMovieTitle()}
            className="w-16 h-24 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/placeholder-movie.svg'
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-accent mb-1 truncate">
              {getMovieTitle()}
            </h3>
            <p className="text-text/70 text-sm mb-2">
              {getMovieYear()} • {getMovieType()}
            </p>
            
            {/* User Rating Section */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text/70">הדירוג שלך:</span>
                {ratingLoading && (
                  <span className="text-xs text-accent">טוען...</span>
                )}
              </div>
              <RatingStars
                rating={userRating}
                onRate={handleRateMovie}
                interactive={!!authUser}
                size="small"
                className="mb-2"
              />
              
              {/* Average Rating */}
              {averageRating.count > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-text/70">ממוצע:</span>
                  <RatingStars
                    rating={averageRating.average}
                    size="small"
                    showValue={true}
                  />
                  <span className="text-xs text-text/50">
                    ({averageRating.count} דירוגים)
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Rating Display */}
            {getMovieRating() && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-accent">⭐</span>
                  <span className="text-accent font-bold">{getMovieRating()}/10</span>
                </div>
                {movie.imdbVotes && (
                  <span className="text-text/50 text-xs">
                    ({movie.imdbVotes} votes)
                  </span>
                )}
              </div>
            )}

            {/* Additional Ratings */}
            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.Ratings.slice(0, 2).map((rating, index) => (
                  <span key={index} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                    {rating.Source}: {rating.Value}
                  </span>
                ))}
              </div>
            )}

            {/* Awards Preview */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="mb-2">
                <span className="text-xs text-accent/80 bg-accent/5 px-2 py-1 rounded">
                  🏆 {movie.Awards.split(',')[0]}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              {variant === 'watchlist' && (
                <button
                  onClick={handleRemoveClick}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  הסר מרשימה
                </button>
              )}

              {showWatchlistButton && user && (
                <button
                  onClick={handleWatchlistClick}
                  className={`text-sm font-medium transition-colors ${
                    isInWatchlist 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-accent hover:text-accentDark'
                  }`}
                >
                  {isInWatchlist ? 'הסר מרשימה' : 'הוסף לרשימה'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Detailed variant (full movie details)
  if (variant === 'detailed') {
    return (
      <div className={`card mb-6 ${className}`}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <img 
              src={getMoviePoster()} 
              alt={getMovieTitle()}
              className="w-48 h-72 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/placeholder-movie.svg'
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-accent mb-2">
              {getMovieTitle()}
            </h2>
            
            {/* Basic Info Row */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-text/70">{getMovieYear()}</span>
              {movie.Runtime && (
                <span className="text-text/70">{movie.Runtime}</span>
              )}
              {movie.Rated && (
                <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                  {movie.Rated}
                </span>
              )}
              {movie.Type && (
                <span className="text-text/70 capitalize">
                  {movie.Type === 'movie' ? 'סרט' : movie.Type === 'series' ? 'סדרה' : 'תוכנית'}
                </span>
              )}
            </div>

            {/* User Rating Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-accent mb-3">דירוג אישי</h3>
              <div className="flex items-center space-x-4">
                <RatingStars
                  rating={userRating}
                  onRate={handleRateMovie}
                  interactive={!!authUser}
                  size="large"
                  showValue={true}
                />
                {ratingLoading && (
                  <span className="text-accent text-sm">טוען...</span>
                )}
              </div>
              {!authUser && (
                <p className="text-text/70 text-sm mt-2">
                  התחבר כדי לדרג סרט זה
                </p>
              )}
            </div>
            
            {/* Community Rating Section */}
            {averageRating.count > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-3">דירוג קהילתי</h3>
                <div className="flex items-center space-x-4">
                  <RatingStars
                    rating={averageRating.average}
                    size="large"
                    showValue={true}
                  />
                  <span className="text-text/70 text-sm">
                    {averageRating.count} דירוגים
                  </span>
                </div>
              </div>
            )}
            
            {/* Ratings Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-accent mb-3">דירוגים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.imdbRating && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      ⭐
                    </div>
                    <div>
                      <div className="text-accent font-bold text-lg">
                        {movie.imdbRating}/10
                      </div>
                      <div className="text-text/70 text-sm">
                        IMDb {movie.imdbVotes && `(${movie.imdbVotes} votes)`}
                      </div>
                    </div>
                  </div>
                )}
                
                {movie.Ratings && movie.Ratings.length > 0 && (
                  <div className="space-y-2">
                    {movie.Ratings.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-text/70 text-sm">{rating.Source}</span>
                        <span className="text-accent font-medium">{rating.Value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Plot Section */}
            {movie.Plot && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-2">תקציר</h3>
                <p className="text-text/80 leading-relaxed">
                  {movie.Plot}
                </p>
              </div>
            )}

            {/* Awards Section */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-2">פרסים והישגים</h3>
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-text/80 leading-relaxed">
                    {movie.Awards}
                  </p>
                </div>
              </div>
            )}

            {/* Genre Section */}
            {movie.Genre && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent mb-2">ז'אנר</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(', ').map(genre => (
                    <span key={genre} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cast & Crew Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-accent mb-3">צוות השחקנים וההפקה</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <h4 className="text-accent font-medium mb-1">בימוי</h4>
                    <p className="text-text/80 text-sm">{movie.Director}</p>
                  </div>
                )}
                
                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <h4 className="text-accent font-medium mb-1">תסריט</h4>
                    <p className="text-text/80 text-sm">{movie.Writer}</p>
                  </div>
                )}
                
                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div className="md:col-span-2">
                    <h4 className="text-accent font-medium mb-1">שחקנים</h4>
                    <p className="text-text/80 text-sm">{movie.Actors}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-accent mb-3">פרטים נוספים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {movie.Language && movie.Language !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">שפה: </span>
                    <span className="text-text/80">{movie.Language}</span>
                  </div>
                )}
                
                {movie.Country && movie.Country !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">מדינה: </span>
                    <span className="text-text/80">{movie.Country}</span>
                  </div>
                )}
                
                {movie.Production && movie.Production !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">הפקה: </span>
                    <span className="text-text/80">{movie.Production}</span>
                  </div>
                )}
                
                {movie.Released && movie.Released !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">תאריך יציאה: </span>
                    <span className="text-text/80">{movie.Released}</span>
                  </div>
                )}
                
                {movie.DVD && movie.DVD !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">תאריך DVD: </span>
                    <span className="text-text/80">{movie.DVD}</span>
                  </div>
                )}
                
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">הכנסות: </span>
                    <span className="text-text/80">{movie.BoxOffice}</span>
                  </div>
                )}
                
                {movie.Metascore && movie.Metascore !== 'N/A' && (
                  <div>
                    <span className="text-accent font-medium">Metascore: </span>
                    <span className="text-text/80">{movie.Metascore}</span>
                  </div>
                )}
                
                {movie.imdbVotes && (
                  <div>
                    <span className="text-accent font-medium">קולות IMDb: </span>
                    <span className="text-text/80">{movie.imdbVotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {user ? (
                isInWatchlist ? (
                  <button 
                    onClick={handleWatchlistClick}
                    className="btn-secondary"
                  >
                    הסר מרשימת צפייה
                  </button>
                ) : (
                  <button 
                    onClick={handleWatchlistClick}
                    className="btn-primary"
                  >
                    הוסף לרשימת צפייה
                  </button>
                )
              ) : (
                <button 
                  onClick={() => alert('עליך להתחבר כדי להוסיף סרטים לרשימת הצפייה')}
                  className="btn-primary"
                >
                  הוסף לרשימת צפייה
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant (simple card)
  return (
    <div 
      className={`card cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105 ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start space-x-4">
        <img 
          src={getMoviePoster()} 
          alt={getMovieTitle()}
          className="w-16 h-24 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = '/placeholder-movie.svg'
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-accent mb-1 truncate">
            {getMovieTitle()}
          </h3>
          <p className="text-text/70 text-sm mb-2">
            {getMovieYear()} • {getMovieType()}
          </p>
          
          {/* User Rating */}
          <div className="mb-2">
            <RatingStars
              rating={userRating}
              onRate={handleRateMovie}
              interactive={!!authUser}
              size="small"
            />
          </div>
          
          {/* Enhanced Rating Display */}
          {getMovieRating() && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                <span className="text-accent">⭐</span>
                <span className="text-accent font-bold">{getMovieRating()}/10</span>
              </div>
              {movie.imdbVotes && (
                <span className="text-text/50 text-xs">
                  ({movie.imdbVotes} votes)
                </span>
              )}
            </div>
          )}

          {/* Awards Preview */}
          {movie.Awards && movie.Awards !== 'N/A' && (
            <div className="mb-2">
              <span className="text-xs text-accent/80 bg-accent/5 px-2 py-1 rounded">
                🏆 {movie.Awards.split(',')[0]}
              </span>
            </div>
          )}

          {/* Genre Preview */}
          {movie.Genre && (
            <div className="flex flex-wrap gap-1">
              {movie.Genre.split(', ').slice(0, 2).map(genre => (
                <span key={genre} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard 