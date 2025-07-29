import React from 'react'
import { SkeletonLoading } from './Loading'

const LoadingGrid = ({ 
  count = 6,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-6',
  className = ''
}) => {
  return (
    <div className={`grid ${columns} ${gap} ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonLoading key={i} />
      ))}
    </div>
  )
}

export default LoadingGrid 