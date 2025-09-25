import { Clock, ChefHat, Utensils } from 'lucide-react'

const FilterPanel = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const filterOptions = {
    cookingTime: [
      { value: 'any', label: 'Any time', icon: '⏰' },
      { value: 'quick', label: '15 mins or less', icon: '⚡' },
      { value: 'medium', label: '30 mins', icon: '🕐' },
      { value: 'long', label: '1+ hour', icon: '🍲' }
    ],
    difficulty: [
      { value: 'any', label: 'Any level', icon: '👨‍🍳' },
      { value: 'easy', label: 'Easy', icon: '😊' },
      { value: 'medium', label: 'Medium', icon: '🤔' },
      { value: 'hard', label: 'Advanced', icon: '🔥' }
    ],
    category: [
      { value: 'any', label: 'All meals', icon: '🍽️' },
      { value: 'breakfast', label: 'Breakfast', icon: '🍳' },
      { value: 'lunch', label: 'Lunch', icon: '🥪' },
      { value: 'dinner', label: 'Dinner', icon: '🍖' },
      { value: 'dessert', label: 'Dessert', icon: '🍰' }
    ]
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Utensils className="h-5 w-5 text-recipe-orange mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Perfect for your schedule</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cooking Time */}
        <div>
          <div className="flex items-center mb-3">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">Cooking Time</label>
          </div>
          <div className="space-y-2">
            {filterOptions.cookingTime.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  console.log('Cooking time filter clicked:', option.value)
                  handleFilterChange('cookingTime', option.value)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-recipe-orange/50 ${
                  filters.cookingTime === option.value
                    ? 'bg-recipe-orange text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                  {filters.cookingTime === option.value && (
                    <span className="text-xs opacity-75">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <div className="flex items-center mb-3">
            <ChefHat className="h-4 w-4 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">Difficulty</label>
          </div>
          <div className="space-y-2">
            {filterOptions.difficulty.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  console.log('Difficulty filter clicked:', option.value)
                  handleFilterChange('difficulty', option.value)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-recipe-orange/50 ${
                  filters.difficulty === option.value
                    ? 'bg-recipe-orange text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                  {filters.difficulty === option.value && (
                    <span className="text-xs opacity-75">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <div className="flex items-center mb-3">
            <Utensils className="h-4 w-4 text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-700">Meal Type</label>
          </div>
          <div className="space-y-2">
            {filterOptions.category.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  console.log('Category filter clicked:', option.value)
                  handleFilterChange('category', option.value)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-recipe-orange/50 ${
                  filters.category === option.value
                    ? 'bg-recipe-orange text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                  {filters.category === option.value && (
                    <span className="text-xs opacity-75">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Reset */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => onFiltersChange({ cookingTime: 'any', difficulty: 'any', category: 'any' })}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Reset all filters
        </button>
      </div>

      {/* Active Filters Summary & Clear Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === 'any') return null
              const option = filterOptions[key]?.find(opt => opt.value === value)
              if (!option) return null
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-recipe-orange/10 text-recipe-orange text-xs rounded-full"
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.label}
                </span>
              )
            })}
            {Object.values(filters).every(value => value === 'any') && (
              <span className="text-sm text-gray-500 italic">No filters applied</span>
            )}
          </div>
          
          {/* Clear All Button */}
          {Object.values(filters).some(value => value !== 'any') && (
            <button
              onClick={() => {
                console.log('Clearing all filters')
                onFiltersChange({
                  cookingTime: 'any',
                  difficulty: 'any',
                  category: 'any'
                })
              }}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterPanel