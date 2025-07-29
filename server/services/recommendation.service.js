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
        throw new Error('User not found')
      }

      const userRatings = user.ratings || []
      
      if (userRatings.length === 0) {
        // If user has no ratings, return popular movies
        return await this.getPopularMovies(limit)
      }

      // Get recommendations based on user's rating patterns
      const recommendations = await this.getRecommendationsByRatings(userRatings, limit)
      
      logger.info(`Generated ${recommendations.length} recommendations for user ${userId}`)
      return recommendations
    } catch (error) {
      logger.error(`Error getting user recommendations: ${error.message}`)
      throw error
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
          const response = await MovieService.searchMovies(query)
          if (response.Search && response.Search.length > 0) {
            results.push(...response.Search.slice(0, 2))
          }
        } catch (error) {
          logger.warn(`Failed to get popular movies for query: ${query}`)
        }
      }
      
      // Remove duplicates
      const seenIds = new Set()
      const uniqueResults = results.filter(movie => {
        if (seenIds.has(movie.imdbID)) {
          return false
        }
        seenIds.add(movie.imdbID)
        return true
      })
      
      return uniqueResults.slice(0, limit)
    } catch (error) {
      logger.error(`Error getting popular movies: ${error.message}`)
      throw error
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

      return uniqueMovies.slice(0, limit)
    } catch (error) {
      logger.error(`Error getting new user recommendations: ${error.message}`)
      throw error
    }
  }
} 