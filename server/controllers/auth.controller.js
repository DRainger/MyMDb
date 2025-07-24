import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const user = new User({ name, email, password })
    await user.save()
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (err) {
    next(err)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (err) {
    next(err)
  }
} 