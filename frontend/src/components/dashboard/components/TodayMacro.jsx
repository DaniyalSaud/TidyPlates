import React from 'react'
import { Progress } from '@/components/ui/progress'

function TodayMacro({ protein, carbs, fats, calories }) {
    const maxCalories = 2000;
    const maxProtein = 120;
    const maxCarbs = 250;
    const maxFats = 90;

    return (
        <div className='h-64 w-80 bg-slate-100 rounded-md px-4 py-3'>
            <h1 className='text-lg font-semibold'>Today's Macro</h1>
            <div className='flex flex-col gap-3 p-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Calories</h1>
                        <h1 className='text-black/40 font-medium'>{calories}/{maxCalories} kcal</h1>
                    </div>
                    <Progress ProgressColor={'bg-indigo-600'} value={(calories / maxCalories) * 100} className='w-full'/>
                </div>
                
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Proteins</h1>
                        <h1 className='text-black/40 font-medium'>{protein}g/{maxProtein}g</h1>
                    </div>
                    <Progress ProgressColor={'bg-red-900'} value={(protein / maxProtein) * 100} className='w-full'/>
                </div>

                <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Carbs</h1>
                        <h1 className='text-black/40 font-medium'>{carbs}g/{maxCarbs}g</h1>
                    </div>
                    <Progress ProgressColor={'bg-green-700'} value={(carbs / maxCarbs) * 100} className='w-full'/>
                </div>
                
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Fats</h1>
                        <h1 className='text-black/40 font-medium'>{fats}g/{maxFats}g</h1>
                    </div>
                    <Progress ProgressColor={'bg-yellow-300'} value={(fats / maxFats) * 100} className='w-full'/>
                </div>
            </div>
        </div>
    )
}

export default TodayMacro