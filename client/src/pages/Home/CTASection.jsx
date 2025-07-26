import React from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const CTASection = () => {
  const { user } = useAuthStore()

  return (
    <section className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white py-20">
      <div className="main-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl mb-8 text-blue-100 font-medium">
            הצטרפו אלינו ותיהנו מחוויית צפייה מתקדמת ומתקדמת
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link 
                to="/dashboard" 
                className="btn-primary bg-white text-blue-700 hover:bg-blue-100 shadow-lg px-10 py-4 text-lg font-semibold transition-all duration-200"
              >
                עבור ללוח הבקרה
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="btn-primary bg-white text-blue-700 hover:bg-blue-100 shadow-lg px-10 py-4 text-lg font-semibold transition-all duration-200"
                >
                  הירשם עכשיו
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 text-lg font-semibold transition-all duration-200"
                >
                  התחבר לחשבון
                </Link>
              </>
            )}
          </div>
          <p className="text-sm text-blue-200 mt-6">
            החלטה מהירה - תוצאות מדהימות! 🚀
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTASection 