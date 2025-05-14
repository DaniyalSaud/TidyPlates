import React from 'react'

function MealCard({type, mealPath, mealName, mealNutrition, cookTime, isActive = false}) {
  return (
    <div className={`antialiased meal-card hover:scale-[1.01] ${isActive ? 'bg-indigo-100 border-2 border-indigo-300' : 'bg-white'} min-w-[24rem] rounded-xl h-full flex flex-col gap-1 px-4 py-3 transition ease-in-out duration-50 shadow-md`}>
        <div className="flex justify-between items-center">
          <h1 className='text-lg font-medium'>{type}</h1>
          {isActive && (
            <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
              Current Meal
            </span>
          )}
        </div>
        <div className='h-2/3 rounded-md relative'>
            <img className='w-full h-full rounded-md bg-slate-200 object-cover' src={mealPath} alt="meal image" />
            <div className='absolute bottom-1.5 right-1.5 bg-black/70 rounded-full px-1.5 py-0.5'>
                <h1 className='font-medium text-sm text-white'>{cookTime}</h1>
            </div>
        </div>
        <div>
            <h1 className='font-medium'>{mealName}</h1>
            <h1 className='text-sm font-medium text-black/40'>{mealNutrition}</h1>
        </div>
    </div>
  )
}

export default MealCard