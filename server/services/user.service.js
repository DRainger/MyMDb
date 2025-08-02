import { createLogger } from '../utils/logger.js'
import {
  findUserById,
  updateUserById,
  deleteUserById,
  getAllUsers as getAllUsersFromDAL
} from '../dal/index.js'

const logger = createLogger('USER-SERVICE')

/**
 * User Service
 * Contains all user-related business logic
 */

export class UserService {
  // Get current user's profile
  static async getCurrentUser(userId) {
    try {
      logger.info(`Getting profile for user: ${userId}`)
      const user = await findUserById(userId)
      
      if (!user) {
        logger.warn(`User not found: ${userId}`)
        throw new Error('User not found')
      }
      
      return user
    } catch (error) {
      logger.error(`Error getting user profile: ${error.message}`)
      throw error
    }
  }

  // Update current user's profile
  static async updateCurrentUser(userId, updates) {
    try {
      logger.info(`Updating profile for user: ${userId}`)
      
      // Validate allowed fields
      const allowedFields = ['name', 'email', 'password']
      const validUpdates = {}
      
      for (const key of allowedFields) {
        if (updates[key]) {
          validUpdates[key] = updates[key]
        }
      }
      
      if (Object.keys(validUpdates).length === 0) {
        throw new Error('No valid fields to update')
      }
      
      const user = await updateUserById(userId, validUpdates)
      
      if (!user) {
        logger.warn(`User not found for update: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`User profile updated successfully: ${userId}`)
      
      return {
        message: 'Profile updated',
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }
    } catch (error) {
      logger.error(`Error updating user profile: ${error.message}`)
      throw error
    }
  }

  // Delete current user's account
  static async deleteCurrentUser(userId) {
    try {
      logger.info(`Deleting account for user: ${userId}`)
      
      const deletedUser = await deleteUserById(userId)
      
      if (!deletedUser) {
        logger.warn(`User not found for deletion: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`User account deleted successfully: ${userId}`)
      
      return { message: 'Account deleted' }
    } catch (error) {
      logger.error(`Error deleting user account: ${error.message}`)
      throw error
    }
  }

  // Change user's password
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      logger.info(`Changing password for user: ${userId}`)
      
      // Validate input
      if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required')
      }
      
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long')
      }
      
      // Get user with password for comparison
      const { findUserByIdWithPassword } = await import('../dal/index.js')
      const user = await findUserByIdWithPassword(userId)
      
      if (!user) {
        logger.warn(`User not found for password change: ${userId}`)
        throw new Error('User not found')
      }
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        logger.warn(`Invalid current password for user: ${userId}`)
        throw new Error('Current password is incorrect')
      }
      
      // Update password - let the User model handle hashing
      await updateUserById(userId, { password: newPassword })
      
      logger.info(`Password changed successfully for user: ${userId}`)
      
      return { 
        message: 'Password updated successfully',
        success: true
      }
    } catch (error) {
      logger.error(`Error changing password: ${error.message}`)
      throw error
    }
  }

  // Get all users (admin function)
  static async getAllUsers() {
    try {
      logger.info('Getting all users')
      const users = await getAllUsersFromDAL()
      return users
    } catch (error) {
      logger.error(`Error getting all users: ${error.message}`)
      throw error
    }
  }

  // Get user by ID (admin function)
  static async getUserById(userId) {
    try {
      logger.info(`Getting user by ID: ${userId}`)
      const user = await findUserById(userId)
      
      if (!user) {
        logger.warn(`User not found: ${userId}`)
        throw new Error('User not found')
      }
      
      return user
    } catch (error) {
      logger.error(`Error getting user by ID: ${error.message}`)
      throw error
    }
  }

  // Update user by ID (admin function)
  static async updateUserById(userId, updates) {
    try {
      logger.info(`Admin updating user: ${userId}`)
      
      // Validate allowed fields for admin
      const allowedFields = ['name', 'email', 'password', 'role']
      const validUpdates = {}
      
      for (const key of allowedFields) {
        if (updates[key]) {
          validUpdates[key] = updates[key]
        }
      }
      
      if (Object.keys(validUpdates).length === 0) {
        throw new Error('No valid fields to update')
      }
      
      const user = await updateUserById(userId, validUpdates)
      
      if (!user) {
        logger.warn(`User not found for admin update: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`User updated successfully by admin: ${userId}`)
      
      return {
        message: 'User updated',
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }
    } catch (error) {
      logger.error(`Error updating user by admin: ${error.message}`)
      throw error
    }
  }

  // Delete user by ID (admin function)
  static async deleteUserById(userId) {
    try {
      logger.info(`Admin deleting user: ${userId}`)
      
      const deletedUser = await deleteUserById(userId)
      
      if (!deletedUser) {
        logger.warn(`User not found for admin deletion: ${userId}`)
        throw new Error('User not found')
      }
      
      logger.info(`User deleted successfully by admin: ${userId}`)
      
      return { message: 'User deleted' }
    } catch (error) {
      logger.error(`Error deleting user by admin: ${error.message}`)
      throw error
    }
  }
} 