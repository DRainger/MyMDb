import { createLogger } from '../utils/logger.js'
import {
  getUserWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  updateUserWatchlist,
  isMovieInWatchlist,
  getWatchlistCount,
  clearWatchlist,
  getWatchlistPaginated
} from '../dal/index.js'

const logger = createLogger('WATCHLIST-SERVICE')

/**
 * Watchlist Service
 * Contains all watchlist-related business logic
 */

export class WatchlistService {
  // Get user's watchlist
  static async getUserWatchlist(userId) {
    try {
      logger.info(`Getting watchlist for user: ${userId}`)
      const watchlist = await getUserWatchlist(userId)
      
      if (watchlist === null) {
        logger.warn(`User not found when getting watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      return watchlist
    } catch (error) {
      logger.error(`Error getting user watchlist: ${error.message}`)
      throw error
    }
  }

  // Add movie to watchlist
  static async addMovieToWatchlist(userId, movieId) {
    try {
      logger.info(`Adding movie ${movieId} to watchlist for user: ${userId}`)
      
      if (!movieId) {
        logger.warn(`Add to watchlist attempt without movieId for user: ${userId}`)
        throw new Error('movieId is required')
      }
      
      const user = await addMovieToWatchlist(userId, movieId)
      
      if (!user) {
        logger.warn(`User not found when adding to watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`Movie ${movieId} added to watchlist for user: ${userId}`)
      return user.watchlist
    } catch (error) {
      if (error.message === 'Movie already in watchlist') {
        logger.warn(`Duplicate movie add attempt: ${movieId} for user: ${userId}`)
        throw error
      }
      logger.error(`Error adding movie to watchlist: ${error.message}`)
      throw error
    }
  }

  // Remove movie from watchlist
  static async removeMovieFromWatchlist(userId, movieId) {
    try {
      logger.info(`Removing movie ${movieId} from watchlist for user: ${userId}`)
      
      if (!movieId) {
        throw new Error('movieId is required')
      }
      
      const user = await removeMovieFromWatchlist(userId, movieId)
      
      if (!user) {
        logger.warn(`User not found when removing from watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`Movie ${movieId} removed from watchlist for user: ${userId}`)
      return user.watchlist
    } catch (error) {
      logger.error(`Error removing movie from watchlist: ${error.message}`)
      throw error
    }
  }

  // Update entire watchlist
  static async updateWatchlist(userId, watchlist) {
    try {
      logger.info(`Updating watchlist for user: ${userId}`)
      
      if (!Array.isArray(watchlist)) {
        throw new Error('watchlist must be an array')
      }
      
      const user = await updateUserWatchlist(userId, watchlist)
      
      if (!user) {
        logger.warn(`User not found when updating watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`Watchlist updated for user: ${userId}`)
      return user.watchlist
    } catch (error) {
      logger.error(`Error updating watchlist: ${error.message}`)
      throw error
    }
  }

  // Check if movie is in watchlist
  static async checkMovieInWatchlist(userId, movieId) {
    try {
      logger.info(`Checking if movie ${movieId} is in watchlist for user: ${userId}`)
      
      if (!movieId) {
        throw new Error('movieId is required')
      }
      
      const isInWatchlist = await isMovieInWatchlist(userId, movieId)
      
      if (isInWatchlist === null) {
        logger.warn(`User not found when checking watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      return { isInWatchlist, movieId }
    } catch (error) {
      logger.error(`Error checking movie in watchlist: ${error.message}`)
      throw error
    }
  }

  // Get watchlist count
  static async getWatchlistCount(userId) {
    try {
      logger.info(`Getting watchlist count for user: ${userId}`)
      const count = await getWatchlistCount(userId)
      
      if (count === null) {
        logger.warn(`User not found when getting watchlist count: ${userId}`)
        throw new Error('User not found')
      }
      
      return { count }
    } catch (error) {
      logger.error(`Error getting watchlist count: ${error.message}`)
      throw error
    }
  }

  // Clear entire watchlist
  static async clearWatchlist(userId) {
    try {
      logger.info(`Clearing watchlist for user: ${userId}`)
      const user = await clearWatchlist(userId)
      
      if (!user) {
        logger.warn(`User not found when clearing watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`Watchlist cleared for user: ${userId}`)
      return { message: 'Watchlist cleared', watchlist: user.watchlist }
    } catch (error) {
      logger.error(`Error clearing watchlist: ${error.message}`)
      throw error
    }
  }

  // Get watchlist with pagination
  static async getWatchlistPaginated(userId, page = 1, limit = 10) {
    try {
      logger.info(`Getting paginated watchlist for user: ${userId}, page: ${page}, limit: ${limit}`)
      
      // Validate pagination parameters
      const validPage = Math.max(1, parseInt(page) || 1)
      const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10))
      
      const result = await getWatchlistPaginated(userId, validPage, validLimit)
      
      if (!result) {
        logger.warn(`User not found when getting paginated watchlist: ${userId}`)
        throw new Error('User not found')
      }
      
      return result
    } catch (error) {
      logger.error(`Error getting paginated watchlist: ${error.message}`)
      throw error
    }
  }
} 