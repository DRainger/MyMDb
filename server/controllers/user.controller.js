import {
  findUserById,
  updateUserById,
  deleteUserById,
  getAllUsers as getAllUsersFromDAL
} from '../dal/index.js'

// Get current user's profile
export const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// Update current user's profile
export const updateMe = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email', 'password']
    const updates = {}
    for (const key of allowedFields) {
      if (req.body[key]) updates[key] = req.body[key]
    }
    
    const user = await updateUserById(req.user.id, updates)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({ 
      message: 'Profile updated', 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    })
  } catch (err) {
    next(err)
  }
}

// Delete current user's account
export const deleteMe = async (req, res, next) => {
  try {
    await deleteUserById(req.user.id)
    res.json({ message: 'Account deleted' })
  } catch (err) {
    next(err)
  }
}

// Admin: Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersFromDAL()
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// Admin: Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// Admin: Update user by ID
export const updateUserById = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email', 'password', 'role']
    const updates = {}
    for (const key of allowedFields) {
      if (req.body[key]) updates[key] = req.body[key]
    }
    
    const user = await updateUserById(req.params.id, updates)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({ 
      message: 'User updated', 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    })
  } catch (err) {
    next(err)
  }
}

// Admin: Delete user by ID
export const deleteUserById = async (req, res, next) => {
  try {
    await deleteUserById(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}

 