import { AuthService } from '../services/index.js'

// Register a new user
export const register = async (req, res, next) => {
  try {
    const result = await AuthService.registerUser(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const result = await AuthService.loginUser(req.body)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
} 