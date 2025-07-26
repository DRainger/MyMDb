import React from 'react'

const FeaturesSection = () => {
  const features = [
    {
      icon: '🎬',
      title: 'חיפוש מתקדם',
      description: 'חיפוש סרטים וסדרות עם פילטרים מתקדמים לפי שנה, סוג תוכן ועוד'
    },
    {
      icon: '📋',
      title: 'רשימת צפייה אישית',
      description: 'צור ושמור רשימת צפייה אישית עם הסרטים והסדרות האהובים עליכם'
    },
    {
      icon: '🔍',
      title: 'פרטים מלאים',
      description: 'קבל מידע מפורט על כל סרט וסדרה כולל תקציר, שחקנים, דירוג ועוד'
    },
    {
      icon: '📱',
      title: 'ממשק מתקדם',
      description: 'ממשק משתמש מודרני ונוח לשימוש בכל המכשירים'
    },
    {
      icon: '🔐',
      title: 'אבטחה מתקדמת',
      description: 'מערכת אימות מאובטחת עם הצפנת סיסמאות וניהול משתמשים'
    },
    {
      icon: '⚡',
      title: 'ביצועים מהירים',
      description: 'אפליקציה מהירה ויעילה עם חיפוש מיידי ותוצאות מדויקות'
    }
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-white/0 to-white/0 pointer-events-none" />
      <div className="main-container relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            למה לבחור ב-MyMSDB?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            אפליקציה מתקדמת המספקת חוויית משתמש מעולה ופיצ'רים מתקדמים
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-white shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-100 hover:border-blue-300 p-8 flex flex-col items-center text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection 