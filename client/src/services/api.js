import useAuthStore from '../store/authStore'

const API_BASE_URL = '/api'

// Create axios-like fetch wrapper
const api = {
  async request(endpoint, options = {}) {
    const { token } = useAuthStore.getState()
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  },

  // POST request
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  },
}

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  deleteProfile: () => api.delete('/users/me'),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

// Watchlist API
export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (movieId) => api.post('/watchlist', { movieId }),
  removeFromWatchlist: (movieId) => api.delete(`/watchlist/${movieId}`),
  updateWatchlist: (watchlist) => api.put('/watchlist', { watchlist }),
  checkMovieInWatchlist: (movieId) => api.get(`/watchlist/check/${movieId}`),
  getWatchlistCount: () => api.get('/watchlist/count'),
  clearWatchlist: () => api.delete('/watchlist'),
  getWatchlistPaginated: (page, limit) => 
    api.get(`/watchlist/paginated?page=${page}&limit=${limit}`),
}

// Rating API
export const ratingAPI = {
  rateMovie: (movieId, rating) => api.post('/ratings', { movieId, rating }),
  getUserRating: (movieId) => api.get(`/ratings/movie/${movieId}`),
  getUserRatings: () => api.get('/ratings/user'),
  removeRating: (movieId) => api.delete(`/ratings/${movieId}`),
  getAverageRating: (movieId) => api.get(`/ratings/average/${movieId}`),
  getUserRatingStats: () => api.get('/ratings/stats'),
  getRecentRatings: (limit = 10) => api.get(`/ratings/recent?limit=${limit}`),
}

// Recommendation API
export const recommendationAPI = {
  getUserRecommendations: (limit = 10) => api.get(`/recommendations/user?limit=${limit}`),
  getNewUserRecommendations: (limit = 10) => api.get(`/recommendations/new-user?limit=${limit}`),
  getTrendingMovies: (limit = 8) => api.get(`/recommendations/trending?limit=${limit}`),
  getSimilarMovies: (movieId, limit = 6) => api.get(`/recommendations/similar/${movieId}?limit=${limit}`),
  getPopularMovies: (limit = 10) => api.get(`/recommendations/popular?limit=${limit}`),
}

// Movie API
export const movieAPI = {
  searchMovies: (params) => {
    const { query, ...otherParams } = params
    // Only include valid parameters
    const validParams = {}
    if (query) validParams.q = query
    if (otherParams.type && ['movie', 'series', 'episode'].includes(otherParams.type)) {
      validParams.type = otherParams.type
    }
    if (otherParams.year && /^\d{4}$/.test(otherParams.year)) {
      validParams.year = otherParams.year
    }
    if (otherParams.page && parseInt(otherParams.page) > 0) {
      validParams.page = otherParams.page
    }
    
    const searchParams = new URLSearchParams(validParams)
    return api.get(`/movies/search?${searchParams}`)
  },
  getMovieById: (params) => {
    const { imdbId } = params
    return api.get(`/movies/${imdbId}`)
  },
  getMovieWithFullPlot: (params) => {
    const { imdbId } = params
    return api.get(`/movies/${imdbId}/full`)
  },
  searchMoviesAdvanced: (params) => {
    // Only include valid parameters
    const validParams = {}
    if (params.query) validParams.query = params.query
    if (params.type && ['movie', 'series', 'episode'].includes(params.type)) {
      validParams.type = params.type
    }
    if (params.year && /^\d{4}$/.test(params.year)) {
      validParams.year = params.year
    }
    if (params.page && parseInt(params.page) > 0) {
      validParams.page = params.page
    }
    
    const searchParams = new URLSearchParams(validParams)
    return api.get(`/movies/search/advanced?${searchParams}`)
  },
  getPopularMovies: () => {
    return api.get('/movies/popular')
  }
}

export default api
