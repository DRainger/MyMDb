import React from 'react'

const ErrorMessage = ({ 
  message, 
  className = '', 
  showIcon = true,
  variant = 'error' // 'error', 'warning', 'info'
}) => {
  const getIcon = () => {
    if (!showIcon) return null
    
    switch (variant) {
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      default: // error
        return (
          <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getMessageClasses = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
      default: // error
        return 'bg-red-500/10 border-red-500/20 text-red-400'
    }
  }

  if (!message) return null

  return (
    <div className={`error-message ${getMessageClasses()} ${className}`}>
      <div className="flex items-center">
        {getIcon()}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

export default ErrorMessage 