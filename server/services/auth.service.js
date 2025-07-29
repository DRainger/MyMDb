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
  // Validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate password strength
  static validatePassword(password) {
    if (password.length < 8) {
      throw new Error('סיסמה חייבת להכיל לפחות 8 תווים')
    }
    
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
    
    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
      throw new Error('סיסמה חייבת להכיל אות גדולה, אות קטנה, מספר ותו מיוחד')
    }
    
    return true
  }

  // Validate name (Hebrew characters only)
  static validateName(name) {
    if (name.length < 2) {
      throw new Error('שם חייב להכיל לפחות 2 תווים')
    }
    
    const hebrewRegex = /^[א-ת\s]+$/
    if (!hebrewRegex.test(name)) {
      throw new Error('שם חייב להכיל רק אותיות בעברית')
    }
    
    return true
  }

  // Register a new user
  static async registerUser(userData) {
    try {
      const { name, email, password } = userData
      
      // Validate required fields
      if (!name || !email || !password) {
        logger.warn('Registration attempt with missing fields')
        throw new Error('כל השדות הם חובה')
      }
      
      // Validate email format
      if (!this.validateEmail(email)) {
        logger.warn(`Registration failed - invalid email format: ${email}`)
        throw new Error('כתובת אימייל לא תקינה')
      }
      
      // Validate name
      this.validateName(name)
      
      // Validate password strength
      this.validatePassword(password)
      
      logger.info(`Registration attempt for email: ${email}`)
      
      // Check if user already exists
      const userExists = await checkUserExistsByEmail(email)
      if (userExists) {
        logger.warn(`Registration failed - email already exists: ${email}`)
        throw new Error('כתובת אימייל זו כבר קיימת במערכת')
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
        throw new Error('אימייל וסיסמה הם חובה')
      }
      
      // Validate email format
      if (!this.validateEmail(email)) {
        logger.warn(`Login failed - invalid email format: ${email}`)
        throw new Error('כתובת אימייל לא תקינה')
      }
      
      logger.info(`Login attempt for email: ${email}`)
      
      // Find user by email
      const user = await findUserByEmail(email)
      if (!user) {
        logger.warn(`Login failed - user not found: ${email}`)
        throw new Error('פרטי התחברות שגויים')
      }
      
      // Verify password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        logger.warn(`Login failed - invalid password for: ${email}`)
        throw new Error('פרטי התחברות שגויים')
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