import React, { useState } from 'react'

const RatingStars = ({ 
  rating = 0, 
  onRate, 
  size = 'medium', 
  interactive = false,
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4'
      case 'large':
        return 'w-6 h-6'
      default:
        return 'w-5 h-5'
    }
  }

  const handleStarClick = (starRating) => {
    if (interactive && onRate) {
      onRate(starRating)
    }
  }

  const handleStarHover = (starRating) => {
    if (interactive) {
      setHoverRating(starRating)
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovering(false)
      setHoverRating(0)
    }
  }

  const displayRating = isHovering ? hoverRating : rating

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleMouseLeave}
          disabled={!interactive}
          className={`transition-colors duration-200 ${
            interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          } ${getSizeClasses()}`}
        >
          <svg
            className={`w-full h-full ${
              star <= displayRating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      
      {showValue && (
        <span className="text-sm text-text/70 mr-2">
          {displayRating > 0 ? `${displayRating}/5` : 'לא דורג'}
        </span>
      )}
    </div>
  )
}

export default RatingStars 