import React from 'react'

const Loading = ({ 
  size = 'medium', 
  variant = 'spinner', 
  text = 'טוען...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  }

  const Spinner = () => (
    <svg 
      className={`animate-spin ${sizeClasses[size]} text-accent`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-accent rounded-full animate-pulse ${
            size === 'small' ? 'w-2 h-2' :
            size === 'medium' ? 'w-3 h-3' :
            size === 'large' ? 'w-4 h-4' : 'w-5 h-5'
          }`}
          style={{
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )

  const Pulse = () => (
    <div className={`bg-accent rounded-full animate-pulse ${sizeClasses[size]}`} />
  )

  const Skeleton = () => (
    <div className="animate-pulse">
      <div className="bg-secondary rounded-lg h-4 mb-2" />
      <div className="bg-secondary rounded-lg h-4 mb-2 w-3/4" />
      <div className="bg-secondary rounded-lg h-4 w-1/2" />
    </div>
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <Dots />
      case 'pulse':
        return <Pulse />
      case 'skeleton':
        return <Skeleton />
      case 'spinner':
      default:
        return <Spinner />
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center justify-center">
        {renderLoader()}
      </div>
      {text && (
        <p className={`mt-3 text-text/70 ${textSizes[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  )
}

// Specific loading components for common use cases
export const PageLoading = ({ text = 'טוען דף...' }) => (
  <div className="min-h-screen bg-primary flex items-center justify-center">
    <Loading size="large" text={text} />
  </div>
)

export const ButtonLoading = ({ text = 'טוען...' }) => (
  <Loading size="small" text={text} />
)

export const CardLoading = ({ text = 'טוען...' }) => (
  <div className="card">
    <Loading size="medium" text={text} />
  </div>
)

export const SkeletonLoading = () => (
  <div className="card">
    <Loading variant="skeleton" />
  </div>
)

export default Loading
