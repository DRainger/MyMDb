import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">
        הדף שחיפשת לא נמצא
      </h2>
      <p className="text-gray-600 mb-8">
        ייתכן שהקישור שגוי או שהדף הוסר
      </p>
      <div className="space-x-4">
        <Link to="/" className="btn-primary">
          חזור לדף הבית
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          לוח בקרה
        </Link>
      </div>
    </div>
  )
}

export default NotFound
