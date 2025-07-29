import React from 'react'

const EmptyState = ({ 
  icon = '📋',
  title = 'אין תוכן',
  description = 'לא נמצא תוכן להצגה',
  actionText = 'פעולה',
  onAction,
  actionLink,
  className = '',
  iconClassName = 'text-6xl mb-4',
  titleClassName = 'text-xl font-semibold text-accent mb-2',
  descriptionClassName = 'text-text/70 mb-6',
  containerClassName = 'text-center py-12'
}) => {
  const ActionComponent = () => {
    if (actionLink) {
      return (
        <a href={actionLink} className="btn-primary">
          {actionText}
        </a>
      )
    }
    
    if (onAction) {
      return (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )
    }
    
    return null
  }

  return (
    <div className={`${containerClassName} ${className}`}>
      <div className={iconClassName}>
        {icon}
      </div>
      <h3 className={titleClassName}>
        {title}
      </h3>
      <p className={descriptionClassName}>
        {description}
      </p>
      <ActionComponent />
    </div>
  )
}

export default EmptyState 