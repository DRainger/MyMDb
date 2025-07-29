import { useState, useCallback, useRef } from 'react'

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)
  
  const {
    immediate = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retryCount = 0,
    retryDelay = 1000
  } = options

  // Cache for storing API responses
  const cache = useRef(new Map())

  const execute = useCallback(async (params = {}, config = {}) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    // Check cache first
    const cacheKey = JSON.stringify({ params, config })
    const cachedData = cache.current.get(cacheKey)
    
    if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
      setData(cachedData.data)
      setError(null)
      return { success: true, data: cachedData.data }
    }

    setLoading(true)
    setError(null)

    let retries = 0
    const maxRetries = config.retryCount || retryCount

    while (retries <= maxRetries) {
      try {
        const result = await apiFunction(params, {
          ...config,
          signal: abortControllerRef.current.signal
        })

        // Cache the result
        cache.current.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        })

        setData(result)
        setLoading(false)
        return { success: true, data: result }
      } catch (err) {
        if (err.name === 'AbortError') {
          // Request was cancelled
          return { success: false, error: 'Request cancelled' }
        }

        if (retries < maxRetries) {
          retries++
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          continue
        }

        setError(err.message)
        setLoading(false)
        return { success: false, error: err.message }
      }
    }
  }, [apiFunction, cacheTime, retryCount, retryDelay])

  const refetch = useCallback((params = {}, config = {}) => {
    return execute(params, { ...config, skipCache: true })
  }, [execute])

  const clearCache = useCallback(() => {
    cache.current.clear()
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    clearCache,
    cancel,
    cleanup
  }
} 