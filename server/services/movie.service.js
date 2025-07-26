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
      
      if (!query) {
        logger.warn('Search attempt without query')
        throw new Error('Query is required')
      }
      
      const response = await axios.get(OMDB_BASE_URL, {
        params: { 
          apikey: config.omdbApiKey, 
          s: query 
        }
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }
      
      logger.info(`Search completed successfully for query: ${query}`)
      return response.data
    } catch (error) {
      logger.error(`Error searching movies: ${error.message}`)
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
      
      const response = await axios.get(OMDB_BASE_URL, {
        params: { 
          apikey: config.omdbApiKey, 
          i: imdbId 
        }
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }
      
      logger.info(`Movie/series details retrieved successfully for IMDB ID: ${imdbId}`)
      return response.data
    } catch (error) {
      logger.error(`Error getting movie details: ${error.message}`)
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
      
      const response = await axios.get(OMDB_BASE_URL, {
        params: { 
          apikey: config.omdbApiKey, 
          i: imdbId,
          plot: 'full'
        }
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }
      
      logger.info(`Movie/series with full plot retrieved successfully for IMDB ID: ${imdbId}`)
      return response.data
    } catch (error) {
      logger.error(`Error getting movie with full plot: ${error.message}`)
      throw error
    }
  }

  // Search with additional parameters
  static async searchMoviesAdvanced(params) {
    try {
      logger.info(`Advanced search with parameters: ${JSON.stringify(params)}`)
      
      const { query, type, year, page = 1 } = params
      
      if (!query) {
        throw new Error('Query is required')
      }
      
      const searchParams = {
        apikey: config.omdbApiKey,
        s: query,
        page: page
      }
      
      // Add optional parameters
      if (type) searchParams.type = type // movie, series, episode
      if (year) searchParams.y = year
      
      const response = await axios.get(OMDB_BASE_URL, {
        params: searchParams
      })
      
      if (response.data.Error) {
        logger.warn(`OMDB API error: ${response.data.Error}`)
        throw new Error(response.data.Error)
      }
      
      logger.info(`Advanced search completed successfully`)
      return response.data
    } catch (error) {
      logger.error(`Error in advanced search: ${error.message}`)
      throw error
    }
  }

  // Validate IMDB ID format
  static validateImdbId(imdbId) {
    try {
      if (!imdbId) {
        return false
      }
      
      // IMDB ID format: tt followed by 7-8 digits
      const imdbIdPattern = /^tt\d{7,8}$/
      return imdbIdPattern.test(imdbId)
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
} 