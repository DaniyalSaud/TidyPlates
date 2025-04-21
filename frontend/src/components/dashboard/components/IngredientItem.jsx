import React from 'react'

function IngredientItem({item, quantity}) {
  return ( 
    <div className='w-full flex justify-between items-center'>
        <h1 className='font-semibold text-black/60'>{item}</h1>
        <h1 className='font-semibold text-black/60'>{quantity}</h1>
    </div>
  )
}

export default IngredientItem