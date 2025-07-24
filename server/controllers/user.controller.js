import User from '../models/User.js'

// Get current user's profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
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
    if (updates.password) {
      // Password will be hashed by pre-save hook
    }
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    Object.assign(user, updates)
    await user.save()
    res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

// Delete current user's account
export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id)
    res.json({ message: 'Account deleted' })
  } catch (err) {
    next(err)
  }
}

// Admin: Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// Admin: Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
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
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    Object.assign(user, updates)
    await user.save()
    res.json({ message: 'User updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

// Admin: Delete user by ID
export const deleteUserById = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}

// Get current user's watchlist
export const getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.watchlist)
  } catch (err) {
    next(err)
  }
}

// Add a movie to watchlist
export const addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body
    if (!movieId) return res.status(400).json({ message: 'movieId is required' })
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.watchlist.some(item => item.movieId === movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' })
    }
    user.watchlist.push({ movieId })
    await user.save()
    res.status(201).json(user.watchlist)
  } catch (err) {
    next(err)
  }
}

// Remove a movie from watchlist
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.watchlist = user.watchlist.filter(item => item.movieId !== movieId)
    await user.save()
    res.json(user.watchlist)
  } catch (err) {
    next(err)
  }
}

// (Optional) Update/reorder watchlist
export const updateWatchlist = async (req, res, next) => {
  try {
    const { watchlist } = req.body // should be an array of { movieId }
    if (!Array.isArray(watchlist)) return res.status(400).json({ message: 'watchlist must be an array' })
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.watchlist = watchlist.map(item => ({ movieId: item.movieId, addedAt: item.addedAt || new Date() }))
    await user.save()
    res.json(user.watchlist)
  } catch (err) {
    next(err)
  }
} 