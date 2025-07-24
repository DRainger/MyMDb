import React from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          לוח בקרה
        </h1>
            <button 
              onClick={handleLogout}
              className="btn-secondary"
            >
              התנתק
            </button>
          </div>
          
          {user && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                שלום {user.name}!
              </h2>
              <p className="text-gray-600">
                ברוך הבא לאזור האישי שלך
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">סטטיסטיקות</h3>
              <p className="text-gray-600">הסטטיסטיקות שלך יופיעו כאן</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">פעילות אחרונה</h3>
              <p className="text-gray-600">הפעילות האחרונה שלך</p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">הגדרות</h3>
              <p className="text-gray-600">נהל את החשבון שלך</p>
            </div>
          </div>
    </div>
  )
}

export default Dashboard