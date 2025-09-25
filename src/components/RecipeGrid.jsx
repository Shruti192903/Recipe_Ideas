import { Heart, Clock, Users, ExternalLink } from 'lucide-react'

const RecipeGrid = ({ recipes, onRecipeClick, favorites, onToggleFavorite }) => {
  const isFavorite = (recipe) => {
    return favorites && favorites.some(fav => fav.idMeal === recipe.idMeal)
  }

  // Handle null, undefined, or empty arrays
  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return null
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      role="main"
      aria-label="Recipe search results"
    >
      {recipes.map((recipe) => (
        <div 
          key={recipe.idMeal} 
          className="recipe-card group focus-within:ring-4 focus-within:ring-recipe-orange/20"
          role="article"
          aria-label={`Recipe for ${recipe.strMeal}`}
        >
          {/* Recipe Image */}
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img
              src={recipe.strMealThumb || '/placeholder-recipe.jpg'}
              alt={recipe.strMeal || 'Recipe image'}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UmVjaXBlIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
              }}
            />
            
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                console.log('Favorite button clicked for:', recipe.strMeal)
                onToggleFavorite(recipe)
              }}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
              aria-label={`${isFavorite(recipe) ? 'Remove from' : 'Add to'} favorites`}
            >
              <Heart 
                className={`h-4 w-4 transition-all duration-200 ${
                  isFavorite(recipe) 
                    ? 'text-red-500 fill-current scale-110' 
                    : 'text-gray-400 hover:text-red-500 hover:scale-110'
                }`}
              />
            </button>

            {/* Category Badge */}
            {recipe.strCategory && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-recipe-orange/90 text-white text-xs font-medium rounded-full">
                {recipe.strCategory}
              </div>
            )}
          </div>

          {/* Recipe Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-recipe-orange transition-colors">
              {recipe.strMeal}
            </h3>

            {/* Recipe Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {recipe.strArea && (
                  <span className="flex items-center">
                    🌍 {recipe.strArea}
                  </span>
                )}
                {recipe.strCategory && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {recipe.strCategory}
                  </span>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('View Recipe clicked for:', recipe.strMeal)
                  onRecipeClick(recipe)
                }}
                className="flex items-center space-x-1 text-recipe-orange hover:text-recipe-orange/80 font-medium transition-colors focus:outline-none focus:underline z-10 relative"
                aria-label={`View full recipe for ${recipe.strMeal}`}
              >
                <span>View Recipe</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Quick</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>4 servings</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="h-2 w-2 rounded-full bg-yellow-300"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Click Overlay - Only covers image area to avoid button conflicts */}
          <button 
            className="absolute inset-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-recipe-orange/20 rounded-lg"
            onClick={(e) => {
              // Only trigger if click is not on a button
              if (!e.target.closest('button')) {
                console.log('Card overlay clicked for:', recipe.strMeal)
                onRecipeClick(recipe)
              }
            }}
            aria-label={`Open ${recipe.strMeal} recipe details`}
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onRecipeClick(recipe)
              }
            }}
            style={{ zIndex: 1 }}
          />
        </div>
      ))}
    </div>
  )
}

export default RecipeGrid