import axios from 'axios'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'

const logger = createLogger('MOVIE-SERVICE')
const OMDB_BASE_URL = 'http://www.omdbapi.com/'

/**
 * Movie Service
 * Contains all movie-related business logic
 */

export class MovieService {
  // Search movies/series
  static async searchMovies(query) {
    try {
      logger.info(`Searching movies/series with query: ${query}`)
      
      if (!query || typeof query !== 'string') {
        logger.warn('Search attempt without valid query')
        throw new Error('Query is required and must be a string')
      }

      // Clean and validate the query
      const cleanQuery = query.trim()
      if (cleanQuery.length < 2) {
        throw new Error('Query must be at least 2 characters long')
      }
      
      // Only send required parameters to OMDB API
      const response = await axios.get(OMDB_BASE_URL, {
        params: { 
          apikey: 'f20f20b2',
          s: cleanQuery
        },
        timeout: 15000 // 15 second timeout
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }

      // Handle case where no results are found
      if (!response.data.Search || response.data.Search.length === 0) {
        logger.info(`No results found for query: ${cleanQuery}`)
        return {
          Search: [],
          totalResults: '0',
          Response: 'True'
        }
      }
      
      logger.info(`Search completed successfully for query: ${cleanQuery}, found ${response.data.Search.length} results`)
      return response.data
    } catch (error) {
      logger.error(`Error searching movies: ${error.message}`)
      if (error.response?.status === 401) {
        throw new Error('API key is invalid or expired')
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again')
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error('Network error - please check your connection')
      }
      throw error
    }
  }

  // Get movie/series details by IMDB ID
  static async getMovieById(imdbId) {
    try {
      logger.info(`Getting movie/series details for IMDB ID: ${imdbId}`)
      
      if (!imdbId) {
        logger.warn('Get movie attempt without IMDB ID')
        throw new Error('imdbId is required')
      }

      // Validate IMDb ID format
      if (!this.validateImdbId(imdbId)) {
        logger.warn(`Invalid IMDb ID format: ${imdbId}`)
        throw new Error('Incorrect IMDb ID format')
      }
      
      // Only send required parameters to OMDB API
      const response = await axios.get(OMDB_BASE_URL, {
        params: { 
          apikey: 'f20f20b2',
          i: imdbId
        },
        timeout: 15000 // 15 second timeout
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }
      
      logger.info(`Movie/series details retrieved successfully for IMDB ID: ${imdbId}`)
      return response.data
    } catch (error) {
      logger.error(`Error getting movie details: ${error.message}`)
      if (error.response?.status === 401) {
        throw new Error('API key is invalid or expired')
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again')
      }
      throw error
    }
  }

  // Get movie/series with full plot
  static async getMovieWithFullPlot(imdbId) {
    try {
      logger.info(`Getting movie/series with full plot for IMDB ID: ${imdbId}`)
      
      if (!imdbId) {
        throw new Error('imdbId is required')
      }

      // Validate IMDb ID format
      if (!this.validateImdbId(imdbId)) {
        logger.warn(`Invalid IMDb ID format: ${imdbId}`)
        throw new Error('Incorrect IMDb ID format')
      }
      
      // Only send required parameters to OMDB API
      const response = await axios.get(OMDB_BASE_URL, {
        params: { 
          apikey: 'f20f20b2',
          i: imdbId,
          plot: 'full'
        },
        timeout: 15000 // 15 second timeout
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }
      
      logger.info(`Movie/series with full plot retrieved successfully for IMDB ID: ${imdbId}`)
      return response.data
    } catch (error) {
      logger.error(`Error getting movie with full plot: ${error.message}`)
      if (error.response?.status === 401) {
        throw new Error('API key is invalid or expired')
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again')
      }
      throw error
    }
  }

  // Search with additional parameters
  static async searchMoviesAdvanced(params) {
    try {
      logger.info(`Advanced search with parameters: ${JSON.stringify(params)}`)
      
      const { query, type, year, page = 1 } = params
      
      if (!query || typeof query !== 'string') {
        throw new Error('Query is required and must be a string')
      }

      // Clean and validate the query
      const cleanQuery = query.trim()
      if (cleanQuery.length < 2) {
        throw new Error('Query must be at least 2 characters long')
      }
      
      // Build search parameters - only include valid ones
      const searchParams = {
        apikey: 'f20f20b2',
        s: cleanQuery
      }
      
      // Add optional parameters only if they are valid
      if (type && ['movie', 'series', 'episode'].includes(type)) {
        searchParams.type = type
      }
      if (year && /^\d{4}$/.test(year)) {
        searchParams.y = year
      }
      if (page && parseInt(page) > 0) {
        searchParams.page = Math.max(1, parseInt(page))
      }
      
      const response = await axios.get(OMDB_BASE_URL, {
        params: searchParams,
        timeout: 15000 // 15 second timeout
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }

      // Handle case where no results are found
      if (!response.data.Search || response.data.Search.length === 0) {
        logger.info(`No results found for advanced search: ${cleanQuery}`)
        return {
          Search: [],
          totalResults: '0',
          Response: 'True'
        }
      }
      
      logger.info(`Advanced search completed successfully`)
      return response.data
    } catch (error) {
      logger.error(`Error in advanced search: ${error.message}`)
      if (error.response?.status === 401) {
        throw new Error('API key is invalid or expired')
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again')
      }
      throw error
    }
  }

  // Validate IMDB ID format
  static validateImdbId(imdbId) {
    try {
      if (!imdbId || typeof imdbId !== 'string') {
        return false
      }
      
      // IMDB ID format: tt followed by 7-8 digits
      const imdbIdPattern = /^tt\d{7,8}$/
      return imdbIdPattern.test(imdbId.trim())
    } catch (error) {
      logger.error(`Error validating IMDB ID: ${error.message}`)
      return false
    }
  }

  // Get movie/series type (movie, series, episode)
  static getContentType(omdbData) {
    try {
      if (!omdbData || !omdbData.Type) {
        return 'unknown'
      }
      
      return omdbData.Type.toLowerCase()
    } catch (error) {
      logger.error(`Error getting content type: ${error.message}`)
      return 'unknown'
    }
  }

  // Get popular movies for home page
  static async getPopularMovies() {
    try {
      logger.info('Getting popular movies for home page')
      
      // Search for popular movies
      const popularQueries = [
        'Batman',
        'Inception', 
        'The Dark Knight',
        'Interstellar'
      ]
      
      const results = []
      
      for (const query of popularQueries) {
        try {
          const response = await this.searchMovies(query)
          if (response.Search && response.Search.length > 0) {
            results.push(...response.Search.slice(0, 2)) // Get 2 movies per query
          }
        } catch (error) {
          logger.warn(`Failed to get popular movies for query: ${query}`)
        }
      }
      
      // Remove duplicates based on IMDb ID
      const uniqueResults = results.filter((movie, index, self) => 
        index === self.findIndex(m => m.imdbID === movie.imdbID)
      )
      
      logger.info(`Retrieved ${uniqueResults.length} popular movies`)
      return {
        Search: uniqueResults.slice(0, 8), // Return max 8 movies
        totalResults: uniqueResults.length.toString(),
        Response: 'True'
      }
    } catch (error) {
      logger.error(`Error getting popular movies: ${error.message}`)
      throw error
    }
  }
} 