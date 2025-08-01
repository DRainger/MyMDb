import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks'
import { useApi } from '../hooks'
import { movieAPI } from '../services/api'
import { LoadingGrid, MovieGrid } from '../components'
import HeroSection from './Home/HeroSection'
import FeaturesSection from './Home/FeaturesSection'
import ProjectDescription from './Home/ProjectDescription'
import CTASection from './Home/CTASection'

const Home = () => {
  const { user } = useAuth()

  // Fetch featured movies for the home page
  const { 
    data: featuredMovies, 
    loading: featuredLoading, 
    error: featuredError,
    execute: fetchFeaturedMovies
  } = useApi(movieAPI.searchMovies, {
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    retryCount: 1
  })

  // Popular movies for "Up Next" section
  const { 
    data: popularMovies, 
    loading: popularLoading,
    execute: fetchPopularMovies
  } = useApi(movieAPI.searchMovies, {
    cacheTime: 30 * 60 * 1000,
    retryCount: 1
  })

  // Load featured movies on component mount
  React.useEffect(() => {
    if (!featuredMovies) {
      // Search for popular movies to show as featured
      fetchFeaturedMovies({ query: 'popular movies 2024' })
    }
  }, [featuredMovies, fetchFeaturedMovies])

  // Load popular movies for "Trending" section
  React.useEffect(() => {
    if (!popularMovies) {
      fetchPopularMovies({ query: 'trending movies series 2024 2023' })
    }
  }, [popularMovies, fetchPopularMovies])

  const renderFeaturedMovies = () => {
    if (featuredLoading) {
      return <LoadingGrid count={4} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
    }

    if (featuredError) {
      return (
        <div className="text-center py-8">
          <p className="text-text/70">לא ניתן לטעון סרטים מומלצים כרגע</p>
          <button 
            onClick={() => fetchFeaturedMovies({ query: 'Batman' })}
            className="btn-secondary mt-4"
          >
            נסה שוב
          </button>
        </div>
      )
    }

    // Default featured items if no API data
    const defaultFeatured = [
      { 
        Title: 'Inception', 
        Year: '2010',
        imdbID: 'tt1375666',
        Type: 'movie',
        Poster: 'N/A',
        Plot: 'סרט מדע בדיוני פורצת דרך על חלומות וחלומות בתוך חלומות.'
      },
      { 
        Title: 'The Shawshank Redemption', 
        Year: '1994',
        imdbID: 'tt0111161',
        Type: 'movie',
        Poster: 'N/A',
        Plot: 'סיפור על תקווה, ידידות וגאולה בכלא.'
      },
      { 
        Title: 'The Dark Knight', 
        Year: '2008',
        imdbID: 'tt0468569',
        Type: 'movie',
        Poster: 'N/A',
        Plot: 'המשך אפל ומרתק לסדרת באטמן של נולאן.'
      },
      { 
        Title: 'Pulp Fiction', 
        Year: '1994',
        imdbID: 'tt0110912',
        Type: 'movie',
        Poster: 'N/A',
        Plot: 'סרט פולחן של טרנטינו עם עלילה מורכבת ומרתקת.'
      }
    ]

    const movies = featuredMovies?.Search?.slice(0, 4) || defaultFeatured

    return (
      <MovieGrid
        movies={movies}
        variant="default"
        columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        className="hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
      />
    )
  }

  const renderTrending = () => {
    if (popularLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 rounded px-2 py-1 w-12 h-6"></div>
                <div className="bg-text/20 rounded h-4 flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Default trending items
    const defaultTrending = [
      { Title: 'Oppenheimer', year: '2023' },
      { Title: 'Barbie', year: '2023' },
      { Title: 'The Super Mario Bros. Movie', year: '2023' },
      { Title: 'Guardians of the Galaxy Vol. 3', year: '2023' },
      { Title: 'Spider-Man: Across the Spider-Verse', year: '2023' },
      { Title: 'The Last of Us', year: '2023' },
      { Title: 'Wednesday', year: '2022' },
      { Title: 'Stranger Things', year: '2022' }
    ]

    const trendingItems = popularMovies?.Search?.slice(0, 8) || defaultTrending

    return (
      <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent hover:scrollbar-thumb-accent/50">
        <ul className="space-y-4">
          {trendingItems.map((item, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <span className="bg-accent text-primary rounded px-2 py-1 text-xs font-bold">
                {item.Year || item.year || 'N/A'}
              </span>
              <span className="text-text font-medium text-sm sm:text-base">
                {item.Title || item.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary text-text">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="main-container py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Today */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-accent">סרטים מומלצים</h2>
                <Link 
                  to="/movies" 
                  className="text-accent hover:text-accentDark text-sm font-medium transition-colors"
                >
                  צפה בכל הסרטים →
                </Link>
              </div>
              {renderFeaturedMovies()}
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-accent">פעולות מהירות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/search" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="font-semibold text-accent">חיפוש סרטים</h3>
                  <p className="text-text/70 text-sm">חפש סרטים וסדרות</p>
                </Link>
                
                {user ? (
                  <Link to="/watchlist" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <h3 className="font-semibold text-accent">רשימת צפייה</h3>
                    <p className="text-text/70 text-sm">ניהול רשימת הצפייה שלך</p>
                  </Link>
                ) : (
                  <Link to="/register" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
                    <div className="text-3xl mb-2">👤</div>
                    <h3 className="font-semibold text-accent">הרשמה</h3>
                    <p className="text-text/70 text-sm">צור חשבון חדש</p>
                  </Link>
                )}
                
                <Link to="/recommendations" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-semibold text-accent">המלצות אישיות</h3>
                  <p className="text-text/70 text-sm">גלה סרטים חדשים</p>
                </Link>
                
                <Link to="/movies" className="card hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center">
                  <div className="text-3xl mb-2">🎬</div>
                  <h3 className="font-semibold text-accent">גלה סרטים חדשים</h3>
                  <p className="text-text/70 text-sm">גלה סרטים חדשים</p>
                </Link>
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
            <div className="bg-secondary rounded-xl p-4 sm:p-6 shadow-lg mb-6 border border-accent/20">
              <h3 className="text-lg sm:text-xl font-bold text-accent mb-4">טרנדינג</h3>
              {renderTrending()}
            </div>
          </aside>
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />
      
      {/* Project Description */}
      <ProjectDescription />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

export default Home
