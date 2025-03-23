import React from 'react'

function MealCard({type, mealPath, mealName, mealNutrition, cookTime}) {
  return (
    <div className='meal-card bg-white w-[20rem] rounded-md h-full flex flex-col gap-1 px-4 py-2'>
        <h1 className='text-lg font-medium'>{type}</h1>
        <div className='h-2/3 rounded-md relative'>
            <img className='w-full h-full rounded-md bg-slate-200' src={mealPath} alt="meal image" />
            <div className='absolute bottom-1.5 right-1.5 bg-black/20 rounded-full px-1.5 py-0.5'>
                <h1 className='font-medium text-sm'>{cookTime}</h1>
            </div>
        </div>
        <div>
            <h1 className='font-medium'>{mealName}</h1>
            <h1 className='text-sm font-medium text-black/60'>{mealNutrition}</h1>
        </div>
    </div>
  )
}

export default MealCard