import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

const SimpleSearch = ({ onSearch = () => {}, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef(null)
  const [forceRefresh, setForceRefresh] = useState(0)

  // Force focus function
  const forceFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(searchTerm.length, searchTerm.length)
      setForceRefresh(prev => prev + 1)
    }
  }

  // Expose force focus globally
  useEffect(() => {
    window.forceSearchFocus = forceFocus
    return () => {
      delete window.forceSearchFocus
    }
  }, [searchTerm])

  // Always ensure focus after any state change
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    // Focus on mount
    focusInput()

    // Focus after loading changes
    if (!loading) {
      setTimeout(focusInput, 100)
    }

    // Global click handler to restore focus
    const handleGlobalClick = (e) => {
      // Don't interfere with button clicks or any interactive elements
      if (e.target.tagName === 'BUTTON' || 
          e.target.closest('button') ||
          e.target.tagName === 'A' ||
          e.target.closest('a') ||
          e.target.hasAttribute('onclick') ||
          e.target.classList.contains('cursor-pointer')) {
        return
      }
      
      // Only focus if clicking on non-interactive areas
      if (inputRef.current && !inputRef.current.contains(e.target) && !loading) {
        setTimeout(() => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus()
          }
        }, 100)
      }
    }

    // Add global event listeners
    document.addEventListener('click', handleGlobalClick)
    window.addEventListener('focus', focusInput)

    return () => {
      document.removeEventListener('click', handleGlobalClick)
      window.removeEventListener('focus', focusInput)
    }
  }, [loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedTerm = searchTerm.trim()
    if (trimmedTerm && !loading) {
      onSearch(trimmedTerm)
    }
  }

  const handleSuggestionClick = (ingredient, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log('Clicking on recipe:', ingredient) // Debug log
    if (!loading) {
      setSearchTerm(ingredient)
      // Use setTimeout to ensure the state update happens
      setTimeout(() => {
        onSearch(ingredient)
      }, 0)
    }
  }

  const handleInputInteraction = (e) => {
    // Always ensure focus and prevent any default behavior that might interfere
    e.preventDefault()
    e.stopPropagation()
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.click() // Ensure cursor is positioned
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Form */}
      <div 
        className="w-full max-w-md mx-auto relative mb-8"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5 z-10 cursor-text" 
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.focus()
                }
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onMouseDown={handleInputInteraction}
              onClick={handleInputInteraction}
              onTouchStart={handleInputInteraction}
              onFocus={() => {
                // Ensure cursor is visible and input is fully focused
                if (inputRef.current) {
                  inputRef.current.setSelectionRange(searchTerm.length, searchTerm.length)
                }
              }}
              placeholder="Search by ingredient or recipe name..."
              className="w-full pl-10 pr-12 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 text-gray-700 bg-white dark:bg-gray-800 dark:text-white dark:border-orange-400 dark:focus:border-orange-300 dark:focus:ring-orange-900 transition-all duration-200 cursor-text shadow-sm hover:border-orange-400 hover:shadow-md"
              disabled={loading}
              autoComplete="off"
              spellCheck="false"
              tabIndex="0"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Popular Ingredients */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 text-center">Popular ingredients:</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'chicken', 'beef', 'pasta', 'tomato', 'cheese', 'onion', 
            'garlic', 'rice', 'potato', 'salmon', 'mushroom', 'spinach'
          ].map((ingredient) => (
            <button
              key={ingredient}
              onClick={(e) => {
                e.preventDefault()  
                e.stopPropagation()
                console.log('Ingredient clicked:', ingredient)
                handleSuggestionClick(ingredient, e)
              }}
              onMouseDown={(e) => e.preventDefault()}
              className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
              disabled={loading}
              type="button"
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="mb-6">
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          🍳 Search by ingredient (e.g., "chicken", "pasta") or recipe name (e.g., "Beef Stir Fry")
        </p>
      </div>
      
      {/* Trending Recipes */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">🔥 Trending Recipes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            'Beef Wellington',
            'Chicken Tikka Masala', 
            'Chocolate Cake',
            'Caesar Salad',
            'Fish and Chips',
            'Pad Thai',
            'Lasagna',
            'Sushi'
          ].map((recipe) => (
            <button
              key={recipe}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Button clicked:', recipe)
                handleSuggestionClick(recipe, e)
              }}
              onMouseDown={(e) => e.preventDefault()}
              className="p-3 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-200 transform hover:scale-105 shadow-md text-sm font-medium disabled:opacity-50 disabled:transform-none disabled:hover:from-orange-400 disabled:hover:to-red-400 cursor-pointer"
              disabled={loading}
              type="button"
            >
              {recipe}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SimpleSearch