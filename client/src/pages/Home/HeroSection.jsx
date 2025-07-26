import React from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const HeroSection = () => {
  const { user } = useAuthStore()

  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 text-white py-28 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl" />
      </div>
      <div className="main-container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            ברוכים הבאים ל-MyMSDB
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 font-medium drop-shadow">
            אפליקציה מתקדמת לחיפוש סרטים וסדרות, ניהול רשימת צפייה אישית, 
            ומעקב אחר התוכן האהוב עליכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link 
                to="/dashboard" 
                className="btn-primary bg-white text-blue-700 hover:bg-blue-100 shadow-lg px-10 py-4 text-lg font-semibold transition-all duration-200"
              >
                לוח בקרה
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="btn-primary bg-white text-blue-700 hover:bg-blue-100 shadow-lg px-10 py-4 text-lg font-semibold transition-all duration-200"
                >
                  התחל עכשיו
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 text-lg font-semibold transition-all duration-200"
                >
                  התחבר
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection 