import { ChefHat } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-recipe-orange"></div>
        
        {/* Inner chef hat icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="h-6 w-6 text-recipe-orange animate-bounce" />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-gray-900 animate-pulse">
          Cooking up some amazing recipes...
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Finding the perfect dishes for you
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-recipe-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-recipe-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-recipe-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default LoadingSpinner