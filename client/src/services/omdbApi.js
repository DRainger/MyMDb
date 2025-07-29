// OMDB API service
const OMDB_API_KEY = 'demo' // Using demo key for testing
const OMDB_BASE_URL = 'https://www.omdbapi.com'

export const omdbAPI = {
  // Search movies by title
  searchMovies: async (query, options = {}) => {
    const params = new URLSearchParams({
      s: query,
      apikey: OMDB_API_KEY,
      ...options
    })

    const response = await fetch(`${OMDB_BASE_URL}/?${params}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }

    const data = await response.json()

    if (data.Response === 'False') {
      throw new Error(data.Error || 'No movies found')
    }

    return data
  },

  // Get movie details by IMDb ID
  getMovieById: async (imdbId, options = {}) => {
    if (!imdbId) {
      throw new Error('Invalid IMDb ID')
    }

    const params = new URLSearchParams({
      i: imdbId,
      apikey: OMDB_API_KEY,
      plot: options.plot || 'short',
      ...options
    })

    const response = await fetch(`${OMDB_BASE_URL}/?${params}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details')
    }

    const data = await response.json()

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found')
    }

    return data
  },

  // Search movies with advanced filters
  searchMoviesAdvanced: async (params) => {
    const searchParams = new URLSearchParams({
      apikey: OMDB_API_KEY,
      ...params
    })

    const response = await fetch(`${OMDB_BASE_URL}/?${searchParams}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies')
    }

    const data = await response.json()

    if (data.Response === 'False') {
      throw new Error(data.Error || 'No movies found')
    }

    return data
  }
}

export default omdbAPI 