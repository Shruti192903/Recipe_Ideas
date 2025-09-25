import { useState, useEffect } from 'react'
import { ChefHat, Search, Clock, Users, Filter, Star, ExternalLink, Heart, Utensils } from 'lucide-react'
import SimpleSearch from './components/SimpleSearch'
import RecipeGrid from './components/RecipeGrid'
import RecipeModal from './components/RecipeModal'
import FilterPanel from './components/FilterPanel'
import LoadingSpinner from './components/LoadingSpinner'
import ShoppingListModal from './components/ShoppingListModal'
import ThemeToggle from './components/ThemeToggle'
import { fetchRecipeByIngredient, fetchRecipeDetails } from './services/api'

function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('recipe-favorites')
      return saved ? JSON.parse(saved) : []
    } catch (err) {
      console.error('Error loading favorites:', err)
      return []
    }
  })
  const [filters, setFilters] = useState({
    cookingTime: 'any',
    difficulty: 'any',  
    category: 'any'
  })

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('recipe-favorites', JSON.stringify(favorites))
    } catch (err) {
      console.error('Error saving favorites:', err)
    }
  }, [favorites])

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      let allRecipes = []
      
      // Strategy 1: Try multiple ingredient searches for complex terms
      const ingredients = searchTerm.toLowerCase()
        .split(/[,\s]+/)
        .map(term => term.trim())
        .filter(term => term.length > 2)
      
      // If single word, try direct search first
      if (ingredients.length === 1) {
        try {
          const data = await fetchRecipeByIngredient(ingredients[0])
          if (data.meals) {
            allRecipes = [...allRecipes, ...data.meals]
          }
        } catch (err) {
          console.log(`No results for ingredient: ${ingredients[0]}`)
        }
      } else {
        // Search for each ingredient separately for complex terms
        for (const ingredient of ingredients) {
          try {
            const data = await fetchRecipeByIngredient(ingredient)
            if (data.meals) {
              allRecipes = [...allRecipes, ...data.meals]
            }
          } catch (err) {
            console.log(`No results for ingredient: ${ingredient}`)
          }
        }
      }
      
      // Strategy 2: Try recipe name search for the full term
      if (allRecipes.length === 0) {
        try {
          const { searchRecipesByName } = await import('./services/api')
          const nameData = await searchRecipesByName(searchTerm)
          if (nameData.meals) {
            allRecipes = [...allRecipes, ...nameData.meals]
          }
        } catch (err) {
          console.log('No results from name search')
        }
      }
      
      // Strategy 3: Try searching for individual words as recipe names
      if (allRecipes.length === 0) {
        const { searchRecipesByName } = await import('./services/api')
        for (const word of ingredients) {
          try {
            const nameData = await searchRecipesByName(word)
            if (nameData.meals) {
              allRecipes = [...allRecipes, ...nameData.meals]
            }
          } catch (err) {
            console.log(`No recipe results for: ${word}`)
          }
        }
      }
      
      // Strategy 4: Try category search for dish types
      if (allRecipes.length === 0) {
        const categoryMappings = {
          'pasta': 'Pasta',
          'noodles': 'Pasta',
          'maggie': 'Pasta',
          'rolls': 'Side',
          'bread': 'Side',
          'chicken': 'Chicken',
          'beef': 'Beef',
          'seafood': 'Seafood',
          'vegetarian': 'Vegetarian',
          'dessert': 'Dessert',
          'breakfast': 'Breakfast'
        }
        
        for (const [key, category] of Object.entries(categoryMappings)) {
          if (searchTerm.toLowerCase().includes(key)) {
            try {
              const { fetchRecipesByCategory } = await import('./services/api')
              const categoryData = await fetchRecipesByCategory(category)
              if (categoryData.meals) {
                // Limit to first 12 results to avoid overwhelming
                allRecipes = [...allRecipes, ...categoryData.meals.slice(0, 12)]
                break
              }
            } catch (err) {
              console.log(`No results for category: ${category}`)
            }
          }
        }
      }
      
      // Strategy 5: Fallback to ingredient mappings
      if (allRecipes.length === 0) {
        const ingredientMappings = {
          'maggie': ['chicken', 'beef'],
          'rolls': ['chicken', 'pork'],
          'vegies': ['mushroom', 'spinach'],
          'veggies': ['mushroom', 'spinach'],
          'flour': ['chicken', 'beef']
        }
        
        for (const [key, fallbackIngredients] of Object.entries(ingredientMappings)) {
          if (searchTerm.toLowerCase().includes(key)) {
            for (const ingredient of fallbackIngredients) {
              try {
                const data = await fetchRecipeByIngredient(ingredient)
                if (data.meals) {
                  allRecipes = [...allRecipes, ...data.meals.slice(0, 6)]
                  break
                }
              } catch (err) {
                console.log(`No results for ingredient: ${ingredient}`)
              }
            }
            if (allRecipes.length > 0) break
          }
        }
      }
      
      // Strategy 6: If still no results, get some random popular recipes
      if (allRecipes.length === 0) {
        try {
          const { fetchMultipleRandomRecipes } = await import('./services/api')
          const randomRecipes = await fetchMultipleRandomRecipes(8)
          allRecipes = randomRecipes
        } catch (err) {
          console.log('Failed to get random recipes')
        }
      }
      
      // Remove duplicates based on meal ID
      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.idMeal === recipe.idMeal)
      )
      
      setRecipes(uniqueRecipes)
      
      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [searchTerm, ...prev.filter(item => item !== searchTerm)]
        return newHistory.slice(0, 5)
      })
    } catch (err) {
      console.error('Error fetching recipes:', err)
      setRecipes([])
      setError(err.userMessage || 'Failed to fetch recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRecipeClick = async (recipe) => {
    try {
      setLoading(true)
      const details = await fetchRecipeDetails(recipe.idMeal)
      if (details && details.meals && details.meals[0]) {
        setSelectedRecipe(details.meals[0])
      } else {
        // Fallback to basic recipe data if detailed fetch fails
        setSelectedRecipe(recipe)
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error)
      // Still show modal with basic recipe info
      setSelectedRecipe(recipe)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (recipe) => {
    if (!recipe || !recipe.idMeal) {
      console.error('Invalid recipe for favorites:', recipe)
      return
    }
    
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.idMeal === recipe.idMeal)
      let newFavorites
      
      if (isFavorite) {
        newFavorites = prev.filter(fav => fav.idMeal !== recipe.idMeal)
        console.log('Removed from favorites:', recipe.strMeal)
      } else {
        newFavorites = [...prev, recipe]
        console.log('Added to favorites:', recipe.strMeal)
      }
      
      // Immediately save to localStorage
      try {
        localStorage.setItem('recipe-favorites', JSON.stringify(newFavorites))
      } catch (err) {
        console.error('Error saving favorites:', err)
      }
      
      return newFavorites
    })
  }

  const filteredRecipes = recipes.filter(recipe => {
    const mealName = recipe.strMeal?.toLowerCase() || ''
    
    // Filter by cooking time (based purely on recipe name keywords)
    if (filters.cookingTime !== 'any') {
      let estimatedTime = 'medium'  // default
      
      // Quick meals (15 mins or less) - look for quick indicators
      if (mealName.includes('quick') || mealName.includes('simple') || 
          mealName.includes('easy') || mealName.includes('salad') ||
          mealName.includes('smoothie') || mealName.includes('sandwich')) {
        estimatedTime = 'quick'
      }
      // Long meals (1+ hour) - look for slow cooking indicators
      else if (mealName.includes('roast') || mealName.includes('slow') ||
               mealName.includes('braised') || mealName.includes('stew') ||
               mealName.includes('casserole') || mealName.includes('baked') ||
               mealName.includes('pot') || mealName.includes('whole')) {
        estimatedTime = 'long'
      }
      
      if (filters.cookingTime !== estimatedTime) return false
    }
    
    // Filter by difficulty (based on recipe name complexity and cooking methods)
    if (filters.difficulty !== 'any') {
      let estimatedDifficulty = 'medium'  // default
      
      // Easy recipes - simple preparation methods
      if (mealName.includes('simple') || mealName.includes('easy') ||
          mealName.includes('quick') || mealName.includes('basic') ||
          mealName.includes('grilled') || mealName.includes('fried') ||
          mealName.includes('sandwich') || mealName.includes('salad') ||
          mealName.includes('scrambled') || mealName.includes('boiled')) {
        estimatedDifficulty = 'easy'
      }
      // Hard recipes - complex techniques or fancy names
      else if (mealName.includes('wellington') || mealName.includes('soufflé') ||
               mealName.includes('confit') || mealName.includes('flambé') ||
               mealName.includes('ragu') || mealName.includes('risotto') ||
               mealName.includes('bisque') || mealName.includes('coq au vin') ||
               mealName.includes('osso buco') || mealName.includes('bourguignon')) {
        estimatedDifficulty = 'hard'
      }
      
      if (filters.difficulty !== estimatedDifficulty) return false
    }
    
    // Filter by meal type (based on recipe name patterns)
    if (filters.category !== 'any') {
      let matchesCategory = false
      
      switch (filters.category) {
        case 'breakfast':
          matchesCategory = mealName.includes('breakfast') || 
                           mealName.includes('pancake') || 
                           mealName.includes('french toast') ||
                           mealName.includes('omelette') ||
                           mealName.includes('scrambled') ||
                           mealName.includes('eggs benedict') ||
                           mealName.includes('porridge') ||
                           mealName.includes('muffin') ||
                           mealName.includes('toast')
          break
          
        case 'lunch':
          matchesCategory = mealName.includes('sandwich') ||
                           mealName.includes('salad') ||
                           mealName.includes('soup') ||
                           mealName.includes('wrap') ||
                           mealName.includes('burger') ||
                           mealName.includes('pasta') ||
                           mealName.includes('noodles') ||
                           mealName.includes('pizza') ||
                           mealName.includes('quesadilla')
          break
          
        case 'dinner':
          matchesCategory = mealName.includes('curry') ||
                           mealName.includes('steak') ||
                           mealName.includes('roast') ||
                           mealName.includes('chops') ||
                           mealName.includes('braised') ||
                           mealName.includes('grilled') ||
                           mealName.includes('baked') ||
                           mealName.includes('stew') ||
                           mealName.includes('casserole') ||
                           mealName.includes('pot') ||
                           // Most chicken dishes are dinner
                           (mealName.includes('chicken') && 
                            !mealName.includes('salad') && 
                            !mealName.includes('sandwich'))
          break
          
        case 'dessert':
          matchesCategory = mealName.includes('cake') ||
                           mealName.includes('cookie') ||
                           mealName.includes('pie') ||
                           mealName.includes('tart') ||
                           mealName.includes('pudding') ||
                           mealName.includes('ice cream') ||
                           mealName.includes('chocolate') ||
                           mealName.includes('dessert') ||
                           mealName.includes('sweet') ||
                           mealName.includes('brownie')
          break
          
        default:
          matchesCategory = true
      }
      
      if (!matchesCategory) return false
    }
    
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-recipe-orange" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Recipe Ideas</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {favorites.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-md px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="View favorite recipes"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                    <span className="font-medium">{favorites.length}</span>
                  </button>
                  
                  {/* Favorites Dropdown */}
                  {showFavorites && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowFavorites(false)}
                      />
                      
                      {/* Dropdown Content */}
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                              <Heart className="h-4 w-4 text-red-500 mr-2" />
                              My Favorites ({favorites.length})
                            </h3>
                            <button
                              onClick={() => setShowFavorites(false)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Favorites List */}
                        <div className="max-h-80 overflow-y-auto">
                          {favorites.length === 0 ? (
                            <div className="p-6 text-center">
                              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No favorites yet
                              </p>
                            </div>
                          ) : (
                            <div className="py-2">
                              {favorites.map((recipe, index) => (
                                <div
                                  key={recipe.idMeal}
                                  className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                  onClick={() => {
                                    setSelectedRecipe(recipe)
                                    setShowFavorites(false)
                                  }}
                                >
                                  <img
                                    src={recipe.strMealThumb}
                                    alt={recipe.strMeal}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                  />
                                  <div className="ml-3 flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {recipe.strMeal}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Click to view recipe
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(recipe)
                                    }}
                                    className="ml-2 text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                                    aria-label="Remove from favorites"
                                  >
                                    <Heart className="h-4 w-4 fill-current" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Footer */}
                        {favorites.length > 0 && (
                          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                            <button
                              onClick={() => setShowFavorites(false)}
                              className="w-full text-center py-2 text-sm text-recipe-orange hover:text-orange-600 font-medium transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {recipes.length === 0 && !loading && !error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-bounce-gentle mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-recipe-orange to-recipe-yellow rounded-full mb-6">
              <Utensils className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            What's in your kitchen?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tell me what ingredients you have, and I'll find amazing recipes that fit your busy schedule.
            From quick 15-minute meals to impressive weekend dishes!
          </p>
          
          {searchHistory.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-3">Recent searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    onClick={() => handleSearch(item)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-recipe-orange"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SimpleSearch 
            key={`search-${recipes.length}-${selectedRecipe ? 'modal' : 'normal'}`}
            onSearch={handleSearch} 
            loading={loading} 
          />
          
          {/* Search Again Hint - only show when we have results */}
          {recipes.length > 0 && !loading && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  if (window.forceSearchFocus) {
                    window.forceSearchFocus()
                  }
                  const searchInput = document.querySelector('input[placeholder*="Search"]')
                  if (searchInput) {
                    searchInput.focus()
                    searchInput.select()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                🔍 Search Again
              </button>
              <p className="text-xs text-gray-500 mt-2">
                💡 <strong>Tip:</strong> Try "pasta", "beef", or "dessert" to discover more recipes!
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 animate-slide-up">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center animate-slide-up">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => setError(null)}
                className="btn-primary bg-red-500 hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {!loading && recipes.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Found {filteredRecipes.length} delicious recipe{filteredRecipes.length !== 1 ? 's' : ''}
                  {searchHistory.length > 0 && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      for "{searchHistory[0]}"
                    </span>
                  )}
                </h3>
                {/* Active Filters Indicator */}
                {(filters.cookingTime !== 'any' || filters.difficulty !== 'any' || filters.category !== 'any') && (
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500 mr-2">Filtered by:</span>
                    {filters.cookingTime !== 'any' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full mr-2 text-xs">
                        {filters.cookingTime === 'quick' ? '15 mins' : filters.cookingTime === 'medium' ? '30 mins' : '1+ hour'}
                      </span>
                    )}
                    {filters.difficulty !== 'any' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full mr-2 text-xs">
                        {filters.difficulty}
                      </span>
                    )}
                    {filters.category !== 'any' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full mr-2 text-xs">
                        {filters.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm px-3 py-1 bg-recipe-orange/10 hover:bg-recipe-orange/20 text-recipe-orange rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-recipe-orange/30"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="text-sm text-gray-500">
                  Click any recipe to see full details
                </div>
              </div>
            </div>
            
            <RecipeGrid 
              recipes={filteredRecipes}
              onRecipeClick={handleRecipeClick}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && searchHistory.length > 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">
              That ingredient might not be in our database. Try main ingredients like meats, vegetables, or specific items.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-700">
              <strong>💡 Search Tips:</strong><br/>
              • Try ingredients: "chicken", "beef", "tomato", "mushroom"<br/>
              • Try dish names: "pasta", "noodles", "curry", "soup"<br/>
              • Try combinations: "chicken rice", "beef noodles"<br/>
              • Common items: "maggie" → noodles, "rolls" → bread recipes
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['chicken', 'pasta', 'beef', 'noodles', 'rice'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-recipe-orange/10 hover:bg-recipe-orange/20 text-recipe-orange rounded-lg transition-colors"
                >
                  Try "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                Your Favorite Recipes
              </h3>
              
              <button
                onClick={() => setShowShoppingList(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-recipe-orange text-white rounded-lg hover:bg-recipe-orange/90 transition-colors shadow-md"
              >
                <ChefHat className="h-4 w-4" />
                <span>Generate Shopping List</span>
              </button>
            </div>
            <RecipeGrid 
              recipes={favorites}
              onRecipeClick={handleRecipeClick}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => {
            setSelectedRecipe(null)
            // Use multiple strategies to restore focus
            setTimeout(() => {
              if (window.forceSearchFocus) {
                window.forceSearchFocus()
              }
              const searchInput = document.querySelector('input[placeholder*="Search"]')
              if (searchInput) {
                searchInput.focus()
                searchInput.click()
              }
            }, 100)
            
            setTimeout(() => {
              if (window.forceSearchFocus) {
                window.forceSearchFocus()
              }
            }, 300)
          }}
          isFavorite={favorites.some(fav => fav.idMeal === selectedRecipe.idMeal)}
          onToggleFavorite={() => toggleFavorite(selectedRecipe)}
        />
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <ShoppingListModal
          recipes={favorites}
          onClose={() => setShowShoppingList(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-6 w-6 mr-2" />
            <span className="font-semibold">Recipe Ideas</span>
          </div>
          <p className="text-gray-400 mb-4">
            Helping busy professionals cook amazing meals at home
          </p>
          <p className="text-sm text-gray-500">
            Powered by TheMealDB API
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App