import React from 'react'

function IngredientItem({item, quantity}) {
  // Safety check to prevent rendering objects directly
  const itemText = typeof item === 'object' ? 
    (item?.name || item?.ingredientName || 'Unknown ingredient') : 
    (item || 'Unknown ingredient');
  
  const quantityText = typeof quantity === 'object' ? 
    JSON.stringify(quantity) : 
    (quantity || '');
  
  return ( 
    <div className='w-full flex justify-between items-center'>
        <h1 className='font-semibold text-black/60'>{itemText}</h1>
        <h1 className='font-semibold text-black/60'>{quantityText}</h1>
    </div>
  )
}

export default IngredientItem