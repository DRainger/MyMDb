/**
 * Data Access Layer (DAL) Index
 * Central export point for all database operations
 */

// User DAL exports
export {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  updateUserById,
  deleteUserById,
  getAllUsers,
  checkUserExistsByEmail
} from './user.dal.js'

// Watchlist DAL exports
export {
  getUserWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  updateUserWatchlist,
  isMovieInWatchlist,
  getWatchlistCount,
  clearWatchlist,
  getWatchlistPaginated
} from './watchlist.dal.js'

// Movie DAL exports
export {
  findMoviesByUserPreferences,
  cacheMovieData,
  getCachedMovieData
} from './movie.dal.js'

// Future DAL exports can be added here:
// export * from './item.dal.js'
// export * from './category.dal.js'
// etc. 