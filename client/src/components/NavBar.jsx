import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const NavBar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="main-container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
              פרויקט הגמר
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              בית
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  לוח בקרה
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">שלום {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary text-sm"
                  >
                    התנתק
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-primary text-sm">
                  התחבר
                </Link>
                <Link to="/register" className="btn-secondary text-sm">
                  הירשם
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
