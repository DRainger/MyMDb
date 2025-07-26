import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const NavBar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-secondary shadow-md">
      <div className="main-container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-accent hover:text-accentDark transition-colors">
              MyMSDB
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-text hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
              בית
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-text hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  לוח בקרה
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-text text-sm">שלום {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary px-3 py-1 rounded text-sm transition-colors"
                  >
                    התנתק
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary px-3 py-1 rounded text-sm transition-colors">
                  התחבר
                </Link>
                <Link to="/register" className="bg-accent text-primary hover:bg-accentDark px-3 py-1 rounded text-sm transition-colors font-medium">
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
