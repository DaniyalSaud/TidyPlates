import React from 'react'
import { Progress } from '@/components/ui/progress'
function TodayMacro({ protein, carbs, fats }) {
    return (
        <div className='h-56 w-80 bg-slate-100 rounded-md px-4 py-3'>
            <h1 className='text-lg font-semibold'>Today's Macro</h1>
            <div className='flex flex-col gap-4 p-4'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Proteins</h1>
                        <h1 className='text-black/40 font-medium'>{protein}g/120g</h1>
                    </div>
                    <Progress ProgressColor={'bg-red-900'} max={120} value={protein} className='w-full'/>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Carbs</h1>
                        <h1 className='text-black/40 font-medium'>{carbs}g/250g</h1>
                    </div>
                    <Progress ProgressColor={'bg-green-700'} max={250} value={carbs} className='w-full'/>
                </div>
                
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-semibold'>Fats</h1>
                        <h1 className='text-black/40 font-medium'>{fats}g/90g</h1>
                    </div>
                    <Progress ProgressColor={'bg-yellow-300'} max={90} value={fats} className='w-full'/>
                </div>


        
            </div>
        </div>
    )
}

export default TodayMacro