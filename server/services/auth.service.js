import { createToken } from '../utils/token.js'
import { createLogger } from '../utils/logger.js'
import { 
  createUser, 
  findUserByEmail, 
  checkUserExistsByEmail 
} from '../dal/index.js'

const logger = createLogger('AUTH-SERVICE')

/**
 * Authentication Service
 * Contains all authentication business logic
 */

export class AuthService {
  // Register a new user
  static async registerUser(userData) {
    try {
      const { name, email, password } = userData
      
      // Validate required fields
      if (!name || !email || !password) {
        logger.warn('Registration attempt with missing fields')
        throw new Error('All fields are required')
      }
      
      logger.info(`Registration attempt for email: ${email}`)
      
      // Check if user already exists
      const userExists = await checkUserExistsByEmail(email)
      if (userExists) {
        logger.warn(`Registration failed - email already exists: ${email}`)
        throw new Error('Email already registered')
      }
      
      // Create new user
      const user = await createUser({ name, email, password })
      
      // Generate JWT token
      const token = await createToken({
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role
      })
      
      logger.info(`User registered successfully: ${user._id}`)
      
      return {
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        token
      }
    } catch (error) {
      logger.error(`Registration error: ${error.message}`)
      throw error
    }
  }

  // Login user
  static async loginUser(credentials) {
    try {
      const { email, password } = credentials
      
      // Validate required fields
      if (!email || !password) {
        logger.warn('Login attempt with missing credentials')
        throw new Error('Email and password are required')
      }
      
      logger.info(`Login attempt for email: ${email}`)
      
      // Find user by email
      const user = await findUserByEmail(email)
      if (!user) {
        logger.warn(`Login failed - user not found: ${email}`)
        throw new Error('Invalid credentials')
      }
      
      // Verify password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        logger.warn(`Login failed - invalid password for: ${email}`)
        throw new Error('Invalid credentials')
      }
      
      // Generate JWT token
      const token = await createToken({
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role
      })
      
      logger.info(`User logged in successfully: ${user._id}`)
      
      return {
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        token
      }
    } catch (error) {
      logger.error(`Login error: ${error.message}`)
      throw error
    }
  }
} 