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

// Movie API
export const movieAPI = {
  searchMovies: (query) => api.get(`/movies/search?q=${encodeURIComponent(query)}`),
  getMovieById: (imdbId) => api.get(`/movies/${imdbId}`),
  getMovieWithFullPlot: (imdbId) => api.get(`/movies/${imdbId}/full`),
  searchMoviesAdvanced: (params) => {
    const searchParams = new URLSearchParams(params)
    return api.get(`/movies/search/advanced?${searchParams}`)
  },
}

export default api
