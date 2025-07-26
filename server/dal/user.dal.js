import User from '../models/User.js'

/**
 * User Data Access Layer
 * Contains all database operations related to users
 */

// Create a new user
export const createUser = async (userData) => {
  try {
    const user = new User(userData)
    return await user.save()
  } catch (error) {
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email })
  } catch (error) {
    throw error
  }
}

// Find user by ID (without password)
export const findUserById = async (userId) => {
  try {
    return await User.findById(userId).select('-password')
  } catch (error) {
    throw error
  }
}

// Find user by ID (with password for auth)
export const findUserByIdWithPassword = async (userId) => {
  try {
    return await User.findById(userId)
  } catch (error) {
    throw error
  }
}

// Update user by ID
export const updateUserById = async (userId, updates) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    Object.assign(user, updates)
    return await user.save()
  } catch (error) {
    throw error
  }
}

// Delete user by ID
export const deleteUserById = async (userId) => {
  try {
    return await User.findByIdAndDelete(userId)
  } catch (error) {
    throw error
  }
}

// Get all users (without passwords)
export const getAllUsers = async () => {
  try {
    return await User.find().select('-password')
  } catch (error) {
    throw error
  }
}



// Check if user exists by email
export const checkUserExistsByEmail = async (email) => {
  try {
    const user = await User.findOne({ email })
    return !!user
  } catch (error) {
    throw error
  }
} 