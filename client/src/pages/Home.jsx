import React from 'react'

// TODO: בנה את דף הבית
// TODO: הוסף hero section, features, וכו'

const Home = () => {
  console.log('Home component is rendering')
  
  return (
    <div className="text-center py-20" style={{backgroundColor: 'lightblue', minHeight: '200px'}}>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        ברוכים הבאים לפרויקט הגמר
      </h1>
      <h2 className="text-2xl text-red-600">TEST - אם אתה רואה את זה הכל עובד!</h2>
      <p className="text-xl text-gray-600 mb-8">
        התחל לבנות את האפליקציה המדהימה שלך
      </p>
      
      {/* TODO: הוסף כפתורי CTA */}
      {/* TODO: הוסף תיאור הפרויקט */}
      {/* TODO: הוסף קישורים לדפים נוספים */}
    </div>
  )
}

export default Home
