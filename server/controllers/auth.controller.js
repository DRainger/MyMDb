import { config } from '../config/index.js'
import { createToken } from '../utils/token.js'
import { createLogger } from '../utils/logger.js'
import { 
  createUser, 
  findUserByEmail, 
  checkUserExistsByEmail 
} from '../dal/index.js'

const logger = createLogger('AUTH-CONTROLLER')

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      logger.warn('Registration attempt with missing fields')
      return res.status(400).json({ message: 'All fields are required' })
    }
    
    logger.info(`Registration attempt for email: ${email}`)
    const userExists = await checkUserExistsByEmail(email)
    if (userExists) {
      logger.warn(`Registration failed - email already exists: ${email}`)
      return res.status(400).json({ message: 'Email already registered' })
    }
    
    const user = await createUser({ name, email, password })
    const token = await createToken(
      { id: user._id, name: user.name, email: user.email, role: user.role }
    )
    
    logger.info(`User registered successfully: ${user._id}`)
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (err) {
    logger.error(`Registration error: ${err.message}`)
    next(err)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      logger.warn('Login attempt with missing credentials')
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    logger.info(`Login attempt for email: ${email}`)
    const user = await findUserByEmail(email)
    if (!user) {
      logger.warn(`Login failed - user not found: ${email}`)
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      logger.warn(`Login failed - invalid password for: ${email}`)
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    const token = await createToken(
      { id: user._id, name: user.name, email: user.email, role: user.role }
    )
    
    logger.info(`User logged in successfully: ${user._id}`)
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (err) {
    logger.error(`Login error: ${err.message}`)
    next(err)
  }
} 