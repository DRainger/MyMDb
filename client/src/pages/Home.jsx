import React from 'react'

const featuredItems = [
  { title: 'סרט מומלץ 1', description: 'תקציר קצר לסרט או סדרה.' },
  { title: 'סרט מומלץ 2', description: 'תקציר קצר לסרט או סדרה.' },
  { title: 'סרט מומלץ 3', description: 'תקציר קצר לסרט או סדרה.' },
  { title: 'סרט מומלץ 4', description: 'תקציר קצר לסרט או סדרה.' },
]

const upNextItems = [
  { title: 'סדרה פופולרית 1', time: '2:25' },
  { title: 'סרט פופולרי 2', time: '1:56' },
  { title: 'סדרה פופולרית 3', time: '2:16' },
]

const Home = () => {
  return (
    <div className="min-h-screen bg-primary text-text">
      <div className="main-container py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Hero Section */}
            <section className="mb-8">
              <div className="rounded-xl bg-gradient-to-br from-secondary via-secondary/80 to-primary p-4 sm:p-8 shadow-lg border border-accent/20">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-accent">ברוכים הבאים ל-MyMSDB</h1>
                <p className="text-base sm:text-lg md:text-xl text-text mb-6">אפליקציה מתקדמת לחיפוש סרטים וסדרות, ניהול רשימת צפייה אישית, ומעקב אחר התוכן האהוב עליכם.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/register" className="bg-accent text-primary hover:bg-accentDark px-6 py-2 rounded font-bold transition text-center">התחל עכשיו</a>
                  <a href="/login" className="border border-accent text-accent hover:bg-accent hover:text-primary px-6 py-2 rounded font-bold transition text-center">התחבר</a>
                </div>
              </div>
            </section>
            {/* Featured Today */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-accent">Featured today</h2>
              {/* Horizontal scroll on mobile, grid on md+ */}
              <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-x-visible">
                {featuredItems.map((item, idx) => (
                  <div key={idx} className="min-w-[220px] md:min-w-0 bg-secondary rounded-lg p-4 shadow hover:shadow-xl transition flex-shrink-0 border border-accent/20">
                    <h3 className="text-base sm:text-lg font-semibold text-accent mb-2">{item.title}</h3>
                    <p className="text-text text-xs sm:text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
            <div className="bg-secondary rounded-xl p-4 sm:p-6 shadow-lg mb-6 border border-accent/20">
              <h3 className="text-lg sm:text-xl font-bold text-accent mb-4">Up next</h3>
              <ul className="space-y-4">
                {upNextItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="bg-accent text-primary rounded px-2 py-1 text-xs font-bold">{item.time}</span>
                    <span className="text-text font-medium text-sm sm:text-base">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-secondary rounded-xl p-4 sm:p-6 shadow-lg border border-accent/20">
              <h4 className="text-base sm:text-lg font-semibold text-accent mb-2">Browse trailers</h4>
              <p className="text-text/70 text-xs sm:text-sm">הפיצ'ר הזה יתווסף בקרוב!</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Home
