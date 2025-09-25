import axios from 'axios'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🔍 Searching for: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (!response.data) {
      throw new Error('Invalid response format')
    }
    console.log(`✅ Found ${response.data.meals?.length || 0} recipes`)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.message)
    
    // Handle different types of errors
    if (error.code === 'ENOTFOUND' || error.code === 'NETWORK_ERROR') {
      error.userMessage = 'Network connection failed. Please check your internet connection.'
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timed out. The server might be slow. Please try again.'
    } else if (error.response?.status >= 500) {
      error.userMessage = 'Server error. Please try again in a few minutes.'
    } else if (error.response?.status === 404) {
      error.userMessage = 'Recipe service not found. Please try again later.'
    } else {
      error.userMessage = 'Something went wrong. Please try again.'
    }
    
    return Promise.reject(error)
  }
)

/**
 * Fetch recipes by main ingredient
 * @param {string} ingredient - The main ingredient to search for
 * @returns {Promise<Object>} - The API response containing meals
 */
export const fetchRecipeByIngredient = async (ingredient) => {
  try {
    const response = await api.get(`/filter.php?i=${encodeURIComponent(ingredient)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching recipes by ingredient:', error)
    throw new Error('Failed to fetch recipes. Please try again.')
  }
}

/**
 * Fetch detailed recipe information by ID
 * @param {string} mealId - The meal ID to get details for
 * @returns {Promise<Object>} - The API response containing meal details
 */
export const fetchRecipeDetails = async (mealId) => {
  try {
    const response = await api.get(`/lookup.php?i=${mealId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    throw new Error('Failed to fetch recipe details. Please try again.')
  }
}

/**
 * Search recipes by name
 * @param {string} name - The recipe name to search for
 * @returns {Promise<Object>} - The API response containing meals
 */
export const searchRecipesByName = async (name) => {
  try {
    const response = await api.get(`/search.php?s=${encodeURIComponent(name)}`)
    return response.data
  } catch (error) {
    console.error('Error searching recipes by name:', error)
    throw new Error('Failed to search recipes. Please try again.')
  }
}

/**
 * Fetch recipes by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Object>} - The API response containing meals
 */
export const fetchRecipesByCategory = async (category) => {
  try {
    const response = await api.get(`/filter.php?c=${encodeURIComponent(category)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching recipes by category:', error)
    throw new Error('Failed to fetch recipes by category. Please try again.')
  }
}

/**
 * Fetch recipes by area/cuisine
 * @param {string} area - The cuisine/area to filter by
 * @returns {Promise<Object>} - The API response containing meals
 */
export const fetchRecipesByArea = async (area) => {
  try {
    const response = await api.get(`/filter.php?a=${encodeURIComponent(area)}`)
    return response.data
  } catch (error) {
    console.error('Error fetching recipes by area:', error)
    throw new Error('Failed to fetch recipes by area. Please try again.')
  }
}

/**
 * Get all available categories
 * @returns {Promise<Object>} - The API response containing categories
 */
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories.php')
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories. Please try again.')
  }
}

/**
 * Get all available areas/cuisines
 * @returns {Promise<Object>} - The API response containing areas
 */
export const fetchAreas = async () => {
  try {
    const response = await api.get('/list.php?a=list')
    return response.data
  } catch (error) {
    console.error('Error fetching areas:', error)
    throw new Error('Failed to fetch areas. Please try again.')
  }
}

/**
 * Get a random recipe
 * @returns {Promise<Object>} - The API response containing a random meal
 */
export const fetchRandomRecipe = async () => {
  try {
    const response = await api.get('/random.php')
    return response.data
  } catch (error) {
    console.error('Error fetching random recipe:', error)
    throw new Error('Failed to fetch random recipe. Please try again.')
  }
}

/**
 * Get multiple random recipes
 * @param {number} count - Number of random recipes to fetch (default: 6)
 * @returns {Promise<Array>} - Array of random recipes
 */
export const fetchMultipleRandomRecipes = async (count = 6) => {
  try {
    const promises = Array.from({ length: count }, () => fetchRandomRecipe())
    const responses = await Promise.all(promises)
    return responses.map(response => response.meals[0]).filter(Boolean)
  } catch (error) {
    console.error('Error fetching multiple random recipes:', error)
    throw new Error('Failed to fetch random recipes. Please try again.')
  }
}

// Export default API instance for direct use if needed
export default api