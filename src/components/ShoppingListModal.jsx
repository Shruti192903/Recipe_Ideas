import { useState } from 'react'
import { ShoppingCart, Check, X, Plus, Printer, Share2 } from 'lucide-react'

const ShoppingListModal = ({ recipes, onClose }) => {
  const [checkedItems, setCheckedItems] = useState(new Set())
  const [customItems, setCustomItems] = useState([])
  const [newItem, setNewItem] = useState('')

  if (!recipes || recipes.length === 0) return null

  // Consolidate ingredients from all recipes
  const consolidateIngredients = () => {
    const ingredientMap = new Map()
    
    recipes.forEach(recipe => {
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`]
        const measure = recipe[`strMeasure${i}`]
        
        if (ingredient && ingredient.trim()) {
          const key = ingredient.trim().toLowerCase()
          if (ingredientMap.has(key)) {
            // Add to existing ingredient (basic quantity combination)
            const existing = ingredientMap.get(key)
            ingredientMap.set(key, {
              ...existing,
              recipes: [...existing.recipes, recipe.strMeal],
              measures: [...existing.measures, measure ? measure.trim() : '']
            })
          } else {
            ingredientMap.set(key, {
              ingredient: ingredient.trim(),
              measures: [measure ? measure.trim() : ''],
              recipes: [recipe.strMeal]
            })
          }
        }
      }
    })
    
    return Array.from(ingredientMap.values()).sort((a, b) => 
      a.ingredient.localeCompare(b.ingredient)
    )
  }

  const consolidatedIngredients = consolidateIngredients()

  const toggleItem = (itemId) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  const addCustomItem = () => {
    if (newItem.trim()) {
      setCustomItems([...customItems, { id: Date.now(), text: newItem.trim() }])
      setNewItem('')
    }
  }

  const removeCustomItem = (id) => {
    setCustomItems(customItems.filter(item => item.id !== id))
  }

  const generateShoppingList = () => {
    const uncheckedIngredients = consolidatedIngredients.filter(
      (_, index) => !checkedItems.has(`ingredient-${index}`)
    )
    const uncheckedCustom = customItems.filter(
      item => !checkedItems.has(`custom-${item.id}`)
    )
    
    const listText = [
      `Shopping List for ${recipes.length} Recipe${recipes.length > 1 ? 's' : ''}`,
      `Generated on ${new Date().toLocaleDateString()}`,
      '',
      'INGREDIENTS:',
      ...uncheckedIngredients.map(item => `• ${item.ingredient} (${item.measures.join(', ')})`),
      '',
      ...(uncheckedCustom.length > 0 ? [
        'ADDITIONAL ITEMS:',
        ...uncheckedCustom.map(item => `• ${item.text}`)
      ] : [])
    ].join('\n')
    
    return listText
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateShoppingList())
      .then(() => alert('Shopping list copied to clipboard!'))
      .catch(() => alert('Failed to copy to clipboard'))
  }

  const printList = () => {
    const printContent = generateShoppingList()
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head><title>Shopping List</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <pre>${printContent}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-recipe-orange text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Shopping List</h2>
                <p className="text-recipe-orange-light">
                  For {recipes.length} recipe{recipes.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
          {/* Recipe Names */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Recipes:</h3>
            <div className="flex flex-wrap gap-2">
              {recipes.map(recipe => (
                <span 
                  key={recipe.idMeal}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {recipe.strMeal}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900">Ingredients:</h3>
            {consolidatedIngredients.map((item, index) => (
              <div 
                key={index}
                className={`flex items-start p-3 rounded-lg border-2 transition-all ${
                  checkedItems.has(`ingredient-${index}`)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(`ingredient-${index}`)}
                  className={`mt-1 mr-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checkedItems.has(`ingredient-${index}`)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {checkedItems.has(`ingredient-${index}`) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                
                <div className="flex-1">
                  <span className={`font-medium ${
                    checkedItems.has(`ingredient-${index}`) 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-900'
                  }`}>
                    {item.ingredient}
                  </span>
                  {item.measures[0] && (
                    <span className="text-gray-600 ml-2">({item.measures.join(', ')})</span>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    For: {item.recipes.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Items */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900">Additional Items:</h3>
            
            {/* Add Custom Item */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                placeholder="Add custom item..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-recipe-orange"
              />
              <button
                onClick={addCustomItem}
                className="px-4 py-2 bg-recipe-orange text-white rounded-lg hover:bg-recipe-orange/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Custom Items List */}
            {customItems.map(item => (
              <div 
                key={item.id}
                className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                  checkedItems.has(`custom-${item.id}`)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(`custom-${item.id}`)}
                  className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checkedItems.has(`custom-${item.id}`)
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {checkedItems.has(`custom-${item.id}`) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                
                <span className={`flex-1 ${
                  checkedItems.has(`custom-${item.id}`) 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'
                }`}>
                  {item.text}
                </span>
                
                <button
                  onClick={() => removeCustomItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {checkedItems.size} of {consolidatedIngredients.length + customItems.length} items checked
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Copy</span>
            </button>
            
            <button
              onClick={printList}
              className="flex items-center space-x-2 px-4 py-2 bg-recipe-orange text-white rounded-lg hover:bg-recipe-orange/90 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingListModal