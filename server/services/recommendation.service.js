import { createLogger } from '../utils/logger.js'
import { MovieService } from './movie.service.js'
import {
  getAllUsers,
  findUserById
} from '../dal/index.js'

const logger = createLogger('RECOMMENDATION-SERVICE')

/**
 * Recommendation Service
 * Contains all recommendation-related business logic
 */

export class RecommendationService {
  // Get personalized recommendations for a user
  static async getUserRecommendations(userId, limit = 10) {
    try {
      logger.info(`Getting recommendations for user: ${userId}`)
      
      const user = await findUserById(userId)
      if (!user) {
        logger.error(`User not found: ${userId}`)
        throw new Error('User not found')
      }

      const userRatings = user.ratings || []
      
      if (userRatings.length === 0) {
        // If user has no ratings, return popular movies
        logger.info(`User ${userId} has no ratings, returning popular movies`)
        const popularMovies = await this.getPopularMovies(limit)
        
        // If popular movies also failed, return new user recommendations
        if (!popularMovies || popularMovies.length === 0) {
          logger.info(`Popular movies failed, returning new user recommendations`)
          const newUserRecs = await this.getNewUserRecommendations(limit)
          return newUserRecs
        }
        
        return popularMovies
      }

      // Get recommendations based on user's rating patterns
      const recommendations = await this.getRecommendationsByRatings(userRatings, limit)
      
      // If no recommendations found, fallback to popular movies
      if (!recommendations || recommendations.length === 0) {
        logger.info(`No recommendations found for user ${userId}, falling back to popular movies`)
        const popularMovies = await this.getPopularMovies(limit)
        
        if (!popularMovies || popularMovies.length === 0) {
          return await this.getNewUserRecommendations(limit)
        }
        
        return popularMovies
      }
      
      logger.info(`Generated ${recommendations.length} recommendations for user ${userId}`)
      return recommendations
    } catch (error) {
      logger.error(`Error getting user recommendations: ${error.message}`)
      // Fallback to new user recommendations if everything fails
      try {
        return await this.getNewUserRecommendations(limit)
      } catch (fallbackError) {
        logger.error(`Fallback recommendations also failed: ${fallbackError.message}`)
        throw error
      }
    }
  }

  // Get recommendations based on user's ratings
  static async getRecommendationsByRatings(userRatings, limit = 10) {
    try {
      // Analyze user's rating patterns
      const userPreferences = this.analyzeUserPreferences(userRatings)
      
      // Get similar movies based on preferences
      const recommendations = []
      
      // Search for movies in user's preferred genres
      for (const genre of userPreferences.topGenres) {
        try {
          const genreMovies = await MovieService.searchMovies(genre)
          if (genreMovies.Search && genreMovies.Search.length > 0) {
            recommendations.push(...genreMovies.Search.slice(0, 3))
          }
        } catch (error) {
          logger.warn(`Failed to get movies for genre: ${genre}`)
        }
      }

      // Search for movies by user's highly rated movies
      const highlyRatedMovies = userRatings
        .filter(rating => rating.rating >= 4)
        .slice(0, 3)

      for (const rating of highlyRatedMovies) {
        try {
          const movieDetails = await MovieService.getMovieById(rating.movieId)
          if (movieDetails.Title) {
            // Search for similar movies
            const similarMovies = await MovieService.searchMovies(movieDetails.Title)
            if (similarMovies.Search && similarMovies.Search.length > 0) {
              recommendations.push(...similarMovies.Search.slice(0, 2))
            }
          }
        } catch (error) {
          logger.warn(`Failed to get similar movies for: ${rating.movieId}`)
        }
      }

      // Remove duplicates and movies user has already rated
      const ratedMovieIds = new Set(userRatings.map(r => r.movieId))
      const uniqueRecommendations = recommendations.filter(movie => 
        !ratedMovieIds.has(movie.imdbID)
      )

      // Remove duplicates based on IMDb ID
      const seenIds = new Set()
      const finalRecommendations = uniqueRecommendations.filter(movie => {
        if (seenIds.has(movie.imdbID)) {
          return false
        }
        seenIds.add(movie.imdbID)
        return true
      })

      return finalRecommendations.slice(0, limit)
    } catch (error) {
      logger.error(`Error getting recommendations by ratings: ${error.message}`)
      throw error
    }
  }

  // Analyze user preferences from ratings
  static analyzeUserPreferences(userRatings) {
    try {
      const preferences = {
        averageRating: 0,
        totalRatings: userRatings.length,
        topGenres: [],
        favoriteYears: [],
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }

      if (userRatings.length === 0) {
        return preferences
      }

      // Calculate average rating
      const totalRating = userRatings.reduce((sum, r) => sum + r.rating, 0)
      preferences.averageRating = totalRating / userRatings.length

      // Calculate rating distribution
      userRatings.forEach(rating => {
        preferences.ratingDistribution[rating.rating]++
      })

      // Get top genres (this would require movie details, simplified for now)
      preferences.topGenres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi']

      // Get favorite years (simplified)
      preferences.favoriteYears = ['2020', '2019', '2018', '2017', '2016']

      return preferences
    } catch (error) {
      logger.error(`Error analyzing user preferences: ${error.message}`)
      return {
        averageRating: 0,
        totalRatings: 0,
        topGenres: ['Action', 'Drama'],
        favoriteYears: ['2020', '2019'],
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }
  }

  // Get popular movies (fallback for new users)
  static async getPopularMovies(limit = 10) {
    try {
      logger.info('Getting popular movies for recommendations')
      console.log(`[DEBUG] getPopularMovies called with limit: ${limit}`)
      
      const popularQueries = [
        'Batman',
        'Inception',
        'The Dark Knight',
        'Interstellar',
        'The Shawshank Redemption',
        'Pulp Fiction',
        'Forrest Gump',
        'The Matrix'
      ]
      
      const results = []
      
      for (const query of popularQueries) {
        try {
          console.log(`[DEBUG] Searching for: ${query}`)
          const response = await MovieService.searchMovies(query)
          console.log(`[DEBUG] Search result for ${query}:`, { 
            hasSearch: !!response.Search, 
            searchLength: response.Search?.length || 0 
          })
          if (response.Search && response.Search.length > 0) {
            results.push(...response.Search.slice(0, 2))
          }
        } catch (error) {
          logger.warn(`Failed to get popular movies for query: ${query}`)
          console.error(`[DEBUG] Failed to search for ${query}:`, error.message)
        }
      }
      
      console.log(`[DEBUG] Total results before deduplication:`, results.length)
      
      // Remove duplicates
      const seenIds = new Set()
      const uniqueResults = results.filter(movie => {
        if (seenIds.has(movie.imdbID)) {
          return false
        }
        seenIds.add(movie.imdbID)
        return true
      })
      
      const result = uniqueResults.slice(0, limit)
      console.log(`[DEBUG] Final result:`, { 
        uniqueCount: uniqueResults.length, 
        finalCount: result.length,
        movies: result.slice(0, 2).map(m => ({ title: m.Title, year: m.Year }))
      })
      
      // If we don't have enough results, try some basic genre searches
      if (result.length < limit) {
        logger.info(`Only found ${result.length} popular movies, trying genre searches`)
        console.log(`[DEBUG] Only found ${result.length} movies, trying genre searches`)
        const genreQueries = ['action', 'drama', 'comedy', 'thriller', 'sci-fi']
        
        for (const query of genreQueries) {
          if (result.length >= limit) break
          
          try {
            console.log(`[DEBUG] Trying genre search: ${query}`)
            const response = await MovieService.searchMovies(query)
            if (response.Search && response.Search.length > 0) {
              const newMovies = response.Search.filter(movie => 
                !seenIds.has(movie.imdbID)
              ).slice(0, limit - result.length)
              
              result.push(...newMovies)
              newMovies.forEach(movie => seenIds.add(movie.imdbID))
              console.log(`[DEBUG] Added ${newMovies.length} movies from genre ${query}`)
            }
          } catch (error) {
            logger.warn(`Failed to get genre search results for: ${query}`)
            console.error(`[DEBUG] Failed genre search for ${query}:`, error.message)
          }
        }
      }
      
      console.log(`[DEBUG] Final popular movies result:`, { 
        count: result.length,
        movies: result.slice(0, 3).map(m => ({ title: m.Title, year: m.Year }))
      })
      return result
    } catch (error) {
      logger.error(`Error getting popular movies: ${error.message}`)
      console.error(`[DEBUG] Error in getPopularMovies:`, error.message)
      // Return some basic fallback movies
      return [
        {
          imdbID: 'tt0468569',
          Title: 'The Dark Knight',
          Year: '2008',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg'
        },
        {
          imdbID: 'tt1375666',
          Title: 'Inception',
          Year: '2010',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
        },
        {
          imdbID: 'tt0111161',
          Title: 'The Shawshank Redemption',
          Year: '1994',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
        }
      ]
    }
  }

  // Get recommendations based on a specific movie
  static async getSimilarMovies(movieId, limit = 6) {
    try {
      logger.info(`Getting similar movies for: ${movieId}`)
      
      const movieDetails = await MovieService.getMovieById(movieId)
      if (!movieDetails || !movieDetails.Title) {
        throw new Error('Movie not found')
      }

      const recommendations = []
      
      // Search by title
      try {
        const titleSearch = await MovieService.searchMovies(movieDetails.Title)
        if (titleSearch.Search && titleSearch.Search.length > 0) {
          recommendations.push(...titleSearch.Search.slice(0, 3))
        }
      } catch (error) {
        logger.warn(`Failed to search by title: ${movieDetails.Title}`)
      }

      // Search by genre if available
      if (movieDetails.Genre) {
        const genres = movieDetails.Genre.split(', ')
        for (const genre of genres.slice(0, 2)) {
          try {
            const genreSearch = await MovieService.searchMovies(genre)
            if (genreSearch.Search && genreSearch.Search.length > 0) {
              recommendations.push(...genreSearch.Search.slice(0, 2))
            }
          } catch (error) {
            logger.warn(`Failed to search by genre: ${genre}`)
          }
        }
      }

      // Remove the original movie and duplicates
      const seenIds = new Set([movieId])
      const uniqueRecommendations = recommendations.filter(movie => {
        if (seenIds.has(movie.imdbID)) {
          return false
        }
        seenIds.add(movie.imdbID)
        return true
      })

      return uniqueRecommendations.slice(0, limit)
    } catch (error) {
      logger.error(`Error getting similar movies: ${error.message}`)
      throw error
    }
  }

  // Get trending movies (based on recent ratings)
  static async getTrendingMovies(limit = 8) {
    try {
      logger.info('Getting trending movies')
      
      const users = await getAllUsers()
      const recentRatings = []
      
      // Collect recent ratings from all users
      users.forEach(user => {
        if (user.ratings) {
          const userRecentRatings = user.ratings
            .filter(rating => {
              const ratingDate = new Date(rating.ratedAt)
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return ratingDate > weekAgo
            })
            .map(rating => ({
              ...rating,
              userId: user._id
            }))
          recentRatings.push(...userRecentRatings)
        }
      })

      // Get most rated movies in the last week
      const movieRatingCounts = {}
      recentRatings.forEach(rating => {
        movieRatingCounts[rating.movieId] = (movieRatingCounts[rating.movieId] || 0) + 1
      })

      const trendingMovieIds = Object.entries(movieRatingCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([movieId]) => movieId)

      // Get movie details for trending movies
      const trendingMovies = []
      for (const movieId of trendingMovieIds) {
        try {
          const movieDetails = await MovieService.getMovieById(movieId)
          if (movieDetails) {
            trendingMovies.push(movieDetails)
          }
        } catch (error) {
          logger.warn(`Failed to get details for trending movie: ${movieId}`)
        }
      }

      return trendingMovies
    } catch (error) {
      logger.error(`Error getting trending movies: ${error.message}`)
      // Fallback to popular movies
      return await this.getPopularMovies(limit)
    }
  }

  // Get recommendations for new users (no ratings yet)
  static async getNewUserRecommendations(limit = 10) {
    try {
      logger.info('Getting recommendations for new user')
      
      // Return a mix of popular and critically acclaimed movies
      const popularMovies = await this.getPopularMovies(Math.floor(limit / 2))
      
      const acclaimedQueries = [
        'The Shawshank Redemption',
        'The Godfather',
        'Pulp Fiction',
        'Schindler\'s List',
        '12 Angry Men'
      ]
      
      const acclaimedMovies = []
      for (const query of acclaimedQueries) {
        try {
          const response = await MovieService.searchMovies(query)
          if (response.Search && response.Search.length > 0) {
            acclaimedMovies.push(...response.Search.slice(0, 1))
          }
        } catch (error) {
          logger.warn(`Failed to get acclaimed movie: ${query}`)
        }
      }

      // Combine and remove duplicates
      const allMovies = [...popularMovies, ...acclaimedMovies]
      const seenIds = new Set()
      const uniqueMovies = allMovies.filter(movie => {
        if (seenIds.has(movie.imdbID)) {
          return false
        }
        seenIds.add(movie.imdbID)
        return true
      })

      const result = uniqueMovies.slice(0, limit)
      
      // If we still don't have enough movies, try some basic searches
      if (result.length < limit) {
        logger.info(`Only found ${result.length} movies, trying basic searches`)
        const basicQueries = ['action', 'drama', 'comedy', 'thriller']
        
        for (const query of basicQueries) {
          if (result.length >= limit) break
          
          try {
            const response = await MovieService.searchMovies(query)
            if (response.Search && response.Search.length > 0) {
              const newMovies = response.Search.filter(movie => 
                !seenIds.has(movie.imdbID)
              ).slice(0, limit - result.length)
              
              result.push(...newMovies)
              newMovies.forEach(movie => seenIds.add(movie.imdbID))
            }
          } catch (error) {
            logger.warn(`Failed to get basic search results for: ${query}`)
          }
        }
      }

      return result
    } catch (error) {
      logger.error(`Error getting new user recommendations: ${error.message}`)
      // Final fallback - return some basic movie data
      return [
        {
          imdbID: 'tt0111161',
          Title: 'The Shawshank Redemption',
          Year: '1994',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
        },
        {
          imdbID: 'tt0068646',
          Title: 'The Godfather',
          Year: '1972',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxOWJmNWYtZjY4ZGY0YzUzYzFhXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg'
        },
        {
          imdbID: 'tt0110912',
          Title: 'Pulp Fiction',
          Year: '1994',
          Type: 'movie',
          Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg'
        }
      ]
    }
  }
} 