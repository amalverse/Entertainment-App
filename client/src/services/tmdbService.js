/**
 * TMDB API SERVICE
 *
 * This file configures the Axios client for making requests to
 * The Movie Database (TMDB) API.
 *
 * Features:
 * - Automatic API key injection
 * - Request timeout handling
 * - Automatic retry on rate limiting (429 errors)
 * - Exponential backoff strategy
 */

import axios from "axios";

// Get API key from environment variables
const TMDB_API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "0261f1c0b6333019cd5c82ccbd21f5fc";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Create Axios instance with default configuration
 * This instance is used for all TMDB API requests
 */
export const tmdb = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds - cancel request if it takes longer
  params: {
    api_key: TMDB_API_KEY, // Automatically add API key to every request
  },
});

/**
 * RESPONSE INTERCEPTOR
 *
 * This intercepts all responses and handles errors automatically.
 * Main purpose: Retry failed requests due to rate limiting or network issues
 */
tmdb.interceptors.response.use(
  // Success: Just return the response as-is
  (response) => response,

  // Error: Implement retry logic
  async (error) => {
    const config = error.config;

    // Initialize retry counter on first error
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }

    /**
     * RETRY LOGIC
     *
     * We retry if:
     * 1. Status is 429 (Too Many Requests / Rate Limited), OR
     * 2. No response (network error)
     *
     * AND we haven't exceeded max retries (3)
     */
    const shouldRetry =
      (error.response?.status === 429 || !error.response) &&
      config.__retryCount < 3;

    if (shouldRetry) {
      config.__retryCount += 1;

      /**
       * EXPONENTIAL BACKOFF
       *
       * Wait progressively longer between retries:
       * - Retry 1: Wait 1 second
       * - Retry 2: Wait 2 seconds
       * - Retry 3: Wait 4 seconds
       *
       * This gives the API time to recover and prevents hammering the server
       */
      const delay = Math.pow(2, config.__retryCount - 1) * 1000;

      console.log(
        `Retrying TMDB request (attempt ${config.__retryCount}/3) after ${delay}ms...`,
      );

      // Wait for the calculated delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request with the same configuration
      return tmdb(config);
    }

    // If we've exhausted retries or error is not retryable, reject the promise
    return Promise.reject(error);
  },
);
