import React, { useState } from 'react'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { CardLoading, SkeletonLoading } from '../components/Loading'

const Dashboard = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      <div className="main-container py-6 md:py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-accent">
            לוח בקרה
          </h1>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? 'יוצא...' : 'התנתק'}
          </button>
        </div>
        
        {user && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-2 text-accent">
              שלום {user.name}!
            </h2>
            <p className="text-text/70">
              ברוך הבא לאזור האישי שלך
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-accent">סטטיסטיקות</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text/70">סרטים שצפית</span>
                <span className="text-accent font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">רשימת צפייה</span>
                <span className="text-accent font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">דירוג ממוצע</span>
                <span className="text-accent font-bold">-</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-accent">פעילות אחרונה</h3>
            <div className="space-y-3">
              <div className="text-text/70 text-sm">
                אין פעילות אחרונה
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-accent">הגדרות</h3>
            <div className="space-y-3">
              <button className="w-full text-right text-text hover:text-accent transition-colors">
                ערוך פרופיל
              </button>
              <button className="w-full text-right text-text hover:text-accent transition-colors">
                שנה סיסמה
              </button>
              <button className="w-full text-right text-text hover:text-accent transition-colors">
                העדפות
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-accent">פעולות מהירות</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn-primary">
              חיפוש סרטים
            </button>
            <button className="btn-secondary">
              רשימת צפייה
            </button>
            <button className="btn-secondary">
              סרטים מומלצים
            </button>
            <button className="btn-secondary">
              היסטוריית צפייה
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard