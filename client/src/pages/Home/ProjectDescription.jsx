import React from 'react'

const ProjectDescription = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-purple-50">
      <div className="main-container bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              על הפרויקט
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">
                מה זה MyMSDB?
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                MyMSDB הוא פרויקט גמר המשלב טכנולוגיות מתקדמות ליצירת אפליקציה 
                לחיפוש וניהול סרטים וסדרות. האפליקציה מאפשרת למשתמשים לחפש 
                תוכן, לשמור רשימות צפייה אישיות, ולקבל מידע מפורט על כל סרט או סדרה.
              </p>
              <h4 className="text-xl font-semibold mb-3 text-blue-700">
                טכנולוגיות בשימוש:
              </h4>
              <ul className="text-gray-700 space-y-2 text-base">
                <li>• <strong>Frontend:</strong> React, Vite, Tailwind CSS</li>
                <li>• <strong>Backend:</strong> Node.js, Express, MongoDB</li>
                <li>• <strong>Authentication:</strong> JWT, bcrypt</li>
                <li>• <strong>API:</strong> OMDB API for movie data</li>
                <li>• <strong>State Management:</strong> Zustand</li>
              </ul>
            </div>
            <div className="bg-white/80 shadow-lg rounded-2xl p-10">
              <h3 className="text-2xl font-semibold mb-4 text-blue-700">
                פיצ'רים עיקריים:
              </h3>
              <ul className="text-gray-700 space-y-3 text-base">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  חיפוש סרטים וסדרות עם OMDB API
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  רשימת צפייה אישית לכל משתמש
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  מערכת אימות מאובטחת
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  ממשק משתמש מודרני וידידותי
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  ארכיטקטורה מודולרית וניתנת להרחבה
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  תמיכה מלאה בעברית ו-RTL
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectDescription 