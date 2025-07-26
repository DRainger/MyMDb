import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-text py-8">
      <div className="main-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">MyMSDB</h3>
            <p className="text-text mb-4">
              אפליקציה מתקדמת לחיפוש וניהול סרטים וסדרות
            </p>
            <p className="text-sm text-text/70">
              פרויקט גמר - טכנולוגיות מתקדמות
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-text hover:text-accent transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-text hover:text-accent transition-colors">
                  התחברות
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-text hover:text-accent transition-colors">
                  הרשמה
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">מידע נוסף</h4>
            <ul className="space-y-2 text-text">
              <li>API: OMDB Database</li>
              <li>טכנולוגיות: React, Node.js, MongoDB</li>
              <li>גרסה: 1.0.0</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-accent/20 mt-8 pt-8 text-center">
          <p className="text-text/70">
            © {currentYear} MyMSDB. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 