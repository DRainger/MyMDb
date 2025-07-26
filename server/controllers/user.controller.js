import { UserService } from '../services/index.js'

// Get current user's profile
export const getMe = async (req, res, next) => {
  try {
    const user = await UserService.getCurrentUser(req.user.id)
    res.json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Update current user's profile
export const updateMe = async (req, res, next) => {
  try {
    const result = await UserService.updateCurrentUser(req.user.id, req.body)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Delete current user's account
export const deleteMe = async (req, res, next) => {
  try {
    const result = await UserService.deleteCurrentUser(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Admin: Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin: Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Admin: Update user by ID
export const updateUserById = async (req, res, next) => {
  try {
    const result = await UserService.updateUserById(req.params.id, req.body)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Admin: Delete user by ID
export const deleteUserById = async (req, res, next) => {
  try {
    const result = await UserService.deleteUserById(req.params.id)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

 