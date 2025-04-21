import React from 'react'

function InstructionsItem({ listNumber, instruction }) {
    return (
        <div className='flex items-start justify-start gap-4 w-full'>
            <div className='min-h-7 min-w-7 rounded-full bg-white flex items-center justify-center'>
                <h1 className='font-semibold text-sm '>{listNumber}</h1>
            </div>
            <h1>{instruction}</h1>
        </div>
    )
}

export default InstructionsItem