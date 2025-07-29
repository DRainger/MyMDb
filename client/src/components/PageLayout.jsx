import React from 'react'

const PageLayout = ({ 
  children, 
  className = '',
  showContainer = true,
  containerClassName = 'main-container py-6 md:py-10'
}) => {
  return (
    <div className={`min-h-screen bg-primary text-text ${className}`}>
      {showContainer ? (
        <div className={containerClassName}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default PageLayout 