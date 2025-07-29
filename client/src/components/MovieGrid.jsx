import React from 'react'
import MovieCard from './MovieCard'

const MovieGrid = ({ 
  movies = [],
  variant = 'search',
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-6',
  className = '',
  onMovieClick,
  showWatchlistButton = false,
  watchlistStatus = {},
  onAddToWatchlist,
  onRemoveFromWatchlist,
  user = null,
  onRemove
}) => {
  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <div className={`grid ${columns} ${gap} ${className}`}>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.imdbID || movie.movieId || index}
          movie={movie}
          variant={variant}
          onClick={onMovieClick}
          onRemove={onRemove}
          showWatchlistButton={showWatchlistButton}
          isInWatchlist={watchlistStatus[movie.imdbID || movie.movieId]}
          onAddToWatchlist={onAddToWatchlist}
          onRemoveFromWatchlist={onRemoveFromWatchlist}
          user={user}
        />
      ))}
    </div>
  )
}

export default MovieGrid 