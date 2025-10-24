/**
 * Utility functions for API URL construction
 */

/**
 * Constructs a proper API URL by ensuring no double slashes
 * @param {string} baseUrl - The base URL (from environment variable)
 * @param {string} endpoint - The API endpoint (e.g., '/api/users')
 * @returns {string} - Properly constructed URL
 */
export const buildApiUrl = (baseUrl, endpoint) => {
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  
  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

/**
 * Gets the API base URL from environment variables
 * @returns {string} - The API base URL
 */
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8084';
};

/**
 * Constructs a full API URL using environment variables
 * @param {string} endpoint - The API endpoint
 * @returns {string} - The complete API URL
 */
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  return buildApiUrl(baseUrl, endpoint);
};
