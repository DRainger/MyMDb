import { createLogger } from '../utils/logger.js'
import {
  findUserById,
  updateUserById,
  getAllUsers
} from '../dal/index.js'
import { MovieService } from './movie.service.js'

const logger = createLogger('RATING-SERVICE')

/**
 * Rating Service
 * Contains all rating-related business logic
 */

export class RatingService {
  // Rate a movie
  static async rateMovie(userId, movieId, rating) {
    try {
      logger.info(`User ${userId} rating movie ${movieId} with ${rating} stars`)
      
      if (!userId || !movieId || !rating) {
        throw new Error('User ID, movie ID, and rating are required')
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }

      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Check if user already rated this movie
      const existingRatingIndex = user.ratings.findIndex(r => r.movieId === movieId)
      
      if (existingRatingIndex !== -1) {
        // Update existing rating
        user.ratings[existingRatingIndex].rating = rating
        user.ratings[existingRatingIndex].ratedAt = new Date()
        logger.info(`Updated existing rating for movie ${movieId}`)
      } else {
        // Add new rating
        user.ratings.push({
          movieId,
          rating,
          ratedAt: new Date()
        })
        logger.info(`Added new rating for movie ${movieId}`)
      }

      await user.save()
      
      return {
        message: existingRatingIndex !== -1 ? 'Rating updated' : 'Rating added',
        rating: {
          movieId,
          rating,
          ratedAt: new Date()
        }
      }
    } catch (error) {
      logger.error(`Error rating movie: ${error.message}`)
      throw error
    }
  }

  // Get user's rating for a specific movie
  static async getUserRating(userId, movieId) {
    try {
      logger.info(`Getting rating for user ${userId} and movie ${movieId}`)
      
      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const rating = user.ratings.find(r => r.movieId === movieId)
      
      return rating ? rating.rating : null
    } catch (error) {
      logger.error(`Error getting user rating: ${error.message}`)
      throw error
    }
  }

  // Get all user's ratings
  static async getUserRatings(userId) {
    try {
      logger.info(`Getting all ratings for user ${userId}`)
      
      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      return user.ratings || []
    } catch (error) {
      logger.error(`Error getting user ratings: ${error.message}`)
      throw error
    }
  }

  // Remove user's rating for a movie
  static async removeRating(userId, movieId) {
    try {
      logger.info(`Removing rating for user ${userId} and movie ${movieId}`)
      
      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const ratingIndex = user.ratings.findIndex(r => r.movieId === movieId)
      
      if (ratingIndex === -1) {
        throw new Error('Rating not found')
      }

      user.ratings.splice(ratingIndex, 1)
      await user.save()
      
      return { message: 'Rating removed' }
    } catch (error) {
      logger.error(`Error removing rating: ${error.message}`)
      throw error
    }
  }

  // Get average rating for a movie across all users
  static async getAverageRating(movieId) {
    try {
      logger.info(`Getting average rating for movie ${movieId}`)
      
      const users = await getAllUsers()
      const ratings = []
      
      users.forEach(user => {
        const userRating = user.ratings?.find(r => r.movieId === movieId)
        if (userRating) {
          ratings.push(userRating.rating)
        }
      })
      
      if (ratings.length === 0) {
        return {
          average: 0,
          count: 0
        }
      }
      
      const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      
      return {
        average: Math.round(average * 10) / 10, // Round to 1 decimal place
        count: ratings.length
      }
    } catch (error) {
      logger.error(`Error getting average rating: ${error.message}`)
      throw error
    }
  }

  // Get user's rating statistics
  static async getUserRatingStats(userId) {
    try {
      logger.info(`Getting rating statistics for user ${userId}`)
      
      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const ratings = user.ratings || []
      
      if (ratings.length === 0) {
        return {
          totalRatings: 0,
          averageRating: 0,
          ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
          },
          favoriteGenre: null
        }
      }
      
      const totalRatings = ratings.length
      const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ratings.forEach(r => {
        ratingDistribution[r.rating]++
      })
      
      // Calculate favorite genre (this would need movie data to be fully accurate)
      // For now, we'll return a placeholder or null
      const favoriteGenre = null // This would be calculated based on rated movies' genres
      
      return {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        favoriteGenre
      }
    } catch (error) {
      logger.error(`Error getting user rating stats: ${error.message}`)
      throw error
    }
  }

  // Get recent ratings for a user (simplified version without OMDB API calls)
  static async getRecentRatingsSimple(userId, limit = 10) {
    try {
      logger.info(`Getting recent ratings for user ${userId} (simple version)`)
      
      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const ratings = user.ratings || []
      logger.info(`Found ${ratings.length} ratings for user ${userId}`)
      
      if (ratings.length === 0) {
        logger.info(`No ratings found for user ${userId}`)
        return {
          ratings: [],
          total: 0
        }
      }
      
      // Log the first few ratings to see their structure
      logger.info(`Sample ratings:`, ratings.slice(0, 3))
      
      // Sort by ratedAt descending and limit, handle missing ratedAt
      const recentRatings = ratings
        .map(rating => ({
          ...rating,
          ratedAt: rating.ratedAt || new Date() // Fallback for ratings without ratedAt
        }))
        .sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt))
        .slice(0, limit)

      logger.info(`Processing ${recentRatings.length} recent ratings`)
      
      // Return basic rating data without movie details
      const basicRatings = recentRatings.map(rating => ({
        ...rating,
        movieTitle: `סרט ${rating.movieId}`,
        movieYear: null,
        moviePoster: null
      }))
      
      logger.info(`Returning ${basicRatings.length} basic ratings`)
      return {
        ratings: basicRatings,
        total: ratings.length
      }
    } catch (error) {
      logger.error(`Error getting recent ratings: ${error.message}`)
      throw error
    }
  }

  // Fix existing ratings that don't have ratedAt field
  static async fixRatingsWithoutRatedAt(userId) {
    try {
      logger.info(`Fixing ratings without ratedAt for user ${userId}`)
      
      const user = await findUserById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      let updated = false
      const ratings = user.ratings || []
      
      for (let i = 0; i < ratings.length; i++) {
        if (!ratings[i].ratedAt) {
          ratings[i].ratedAt = new Date()
          updated = true
          logger.info(`Added ratedAt to rating ${i} for movie ${ratings[i].movieId}`)
        }
      }
      
      if (updated) {
        await user.save()
        logger.info(`Updated ${ratings.length} ratings for user ${userId}`)
      }
      
      return { updated, count: ratings.length }
    } catch (error) {
      logger.error(`Error fixing ratings: ${error.message}`)
      throw error
    }
  }
} 