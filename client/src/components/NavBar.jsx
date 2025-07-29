import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks'

const NavBar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-secondary text-text shadow-lg border-b border-accent/20">
      <div className="main-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold text-accent">MyMSDB</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-accent text-primary shadow-md' 
                  : 'text-text hover:text-accent hover:bg-accent/10'
              }`}
            >
              דף הבית
            </Link>
            
            <Link 
              to="/search" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/search') 
                  ? 'bg-accent text-primary shadow-md' 
                  : 'text-text hover:text-accent hover:bg-accent/10'
              }`}
            >
              חיפוש
            </Link>
            
            <Link 
              to="/movies" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/movies') 
                  ? 'bg-accent text-primary shadow-md' 
                  : 'text-text hover:text-accent hover:bg-accent/10'
              }`}
            >
              גלה סרטים חדשים
            </Link>
            
            <Link 
              to="/recommendations" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/recommendations') 
                  ? 'bg-accent text-primary shadow-md' 
                  : 'text-text hover:text-accent hover:bg-accent/10'
              }`}
            >
              המלצות
            </Link>

            {user ? (
              <>
                <Link 
                  to="/watchlist" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/watchlist') 
                      ? 'bg-accent text-primary shadow-md' 
                      : 'text-text hover:text-accent hover:bg-accent/10'
                  }`}
                >
                  רשימת צפייה
                </Link>
                
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/dashboard') 
                      ? 'bg-accent text-primary shadow-md' 
                      : 'text-text hover:text-accent hover:bg-accent/10'
                  }`}
                >
                  לוח בקרה
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/login') 
                      ? 'bg-accent text-primary shadow-md' 
                      : 'text-text hover:text-accent hover:bg-accent/10'
                  }`}
                >
                  התחברות
                </Link>
                
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-lg font-medium bg-accent text-primary hover:bg-accentDark shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-text/70 px-3 py-1 rounded-lg bg-accent/10">
                שלום, {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium text-text hover:text-accent hover:bg-accent/10 transition-all duration-200"
              >
                התנתק
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-text hover:text-accent hover:bg-accent/10 transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
