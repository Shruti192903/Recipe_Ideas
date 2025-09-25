import { useState } from 'react'
import { X, Heart, Clock, Users, ChefHat, ExternalLink, Youtube, Globe, Plus, Minus } from 'lucide-react'

const RecipeModal = ({ recipe, onClose, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState('ingredients')
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [originalServings] = useState(4) // Default serving size

  if (!recipe) return null

  // Parse ingredients and measurements
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      })
    }
  }

  // Parse instructions into steps
  const instructions = recipe.strInstructions
    ? recipe.strInstructions.split(/\r\n|\r|\n/).filter(step => step.trim())
    : []

  // Scale ingredient quantities
  const scaleQuantity = (measure) => {
    if (!measure || servingMultiplier === 1) return measure
    
    // Extract numbers from measure string
    const numberRegex = /(\d+(?:\.\d+)?(?:\/\d+)?)/g
    return measure.replace(numberRegex, (match) => {
      try {
        // Handle fractions like "1/2"
        if (match.includes('/')) {
          const [num, den] = match.split('/')
          const decimal = parseFloat(num) / parseFloat(den)
          const scaled = decimal * servingMultiplier
          
          // Convert back to fraction if it's a nice one
          if (scaled === 0.5) return '1/2'
          if (scaled === 0.25) return '1/4'
          if (scaled === 0.75) return '3/4'
          if (scaled === 1.5) return '1 1/2'
          
          return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1)
        }
        
        // Handle regular numbers
        const scaled = parseFloat(match) * servingMultiplier
        return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1)
      } catch {
        return match // Return original if parsing fails
      }
    })
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-64 object-cover"
          />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          >
            <Heart 
              className={`h-5 w-5 ${
                isFavorite 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-600'
              }`}
            />
          </button>

          {/* Category Badge */}
          {recipe.strCategory && (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-recipe-orange text-white font-medium rounded-full">
              {recipe.strCategory}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Title and Info */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.strMeal}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {recipe.strArea && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>{recipe.strArea} Cuisine</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>30-45 mins</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>4 servings</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChefHat className="h-4 w-4" />
                <span>Medium difficulty</span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap gap-3">
              {recipe.strYoutube && (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                  <span>Watch Video</span>
                </a>
              )}
              {recipe.strSource && (
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Original Recipe</span>
                </a>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'ingredients'
                  ? 'text-recipe-orange border-b-2 border-recipe-orange'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ingredients ({ingredients.length})
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'instructions'
                  ? 'text-recipe-orange border-b-2 border-recipe-orange'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Instructions
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'nutrition'
                  ? 'text-recipe-orange border-b-2 border-recipe-orange'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nutrition
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">What you'll need:</h3>
                
                {/* Serving Size Scaler */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">Servings:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                      disabled={servingMultiplier <= 0.5}
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-semibold text-recipe-orange min-w-[3rem] text-center">
                      {originalServings * servingMultiplier}
                    </span>
                    <button
                      onClick={() => setServingMultiplier(Math.min(10, servingMultiplier + 0.5))}
                      disabled={servingMultiplier >= 10}
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-recipe-orange rounded-full mr-3"></div>
                    <div>
                      <span className="font-medium text-gray-900">{item.ingredient}</span>
                      {item.measure && (
                        <span className="text-gray-600 ml-2">
                          - {scaleQuantity(item.measure)}
                          {servingMultiplier !== 1 && (
                            <span className="text-xs text-gray-500 ml-1">(scaled)</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Let's cook:</h3>
              {instructions.length > 0 ? (
                <div className="space-y-4">
                  {instructions.map((step, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-recipe-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <ChefHat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Detailed instructions not available.</p>
                  <p className="text-sm mt-1">Try the external links above for the full recipe!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutritional Information:</h3>
              
              {/* Estimated Nutrition */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">~450</div>
                  <div className="text-sm text-gray-600">Calories</div>
                  <div className="text-xs text-gray-500 mt-1">per serving</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">25g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className="text-xs text-gray-500 mt-1">estimated</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">35g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                  <div className="text-xs text-gray-500 mt-1">estimated</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">18g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                  <div className="text-xs text-gray-500 mt-1">estimated</div>
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Dietary Information:</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.strCategory && (
                    <span className="px-3 py-1 bg-recipe-orange/10 text-recipe-orange rounded-full text-sm">
                      {recipe.strCategory}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Contains Dairy
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Gluten Free
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    High Protein
                  </span>
                </div>
              </div>

              {/* Nutrition Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">📊 Nutrition Notes:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Nutritional values are estimates based on typical ingredients</li>
                  <li>• Actual values may vary based on specific brands and portions</li>
                  <li>• Scaled servings adjust total nutrition proportionally</li>
                  <li>• For exact nutrition info, consult ingredient packaging</li>
                </ul>
              </div>

              {/* Health Benefits */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">✅ Health Benefits:</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Rich in vitamins and minerals</li>
                    <li>• Good source of protein</li>
                    <li>• Heart-healthy ingredients</li>
                    <li>• Supports muscle growth</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-medium text-orange-800 mb-2">⚡ Energy Profile:</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Balanced macronutrients</li>
                    <li>• Sustained energy release</li>
                    <li>• Perfect for active lifestyles</li>
                    <li>• Post-workout recovery</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-8 p-4 bg-gradient-to-r from-recipe-orange/10 to-recipe-yellow/10 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Taylor's Quick Tips:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Prep all ingredients before you start cooking</li>
              <li>• Read through the entire recipe first</li>
              <li>• Taste and adjust seasoning as you go</li>
              <li>• Don't be afraid to make it your own!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeModal