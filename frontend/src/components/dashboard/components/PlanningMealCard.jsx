import React from 'react'

function PlanningMealCard({type, time, mealName, calCount, imgPath}) {
  
  const formatTime = (time) => {
    // Convert time to 12-hour format
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
  
    return (
    <div className='h-50 w-[20rem] rounded-lg flex flex-col gap-4 justify-start item-center bg-gray-200 py-4 px-7 shadow-lg shadow-black/20 transition-all ease-in-out hover:scale-[1.02]'>
        
        <div className='top flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>{type}</h1>
            <h1 className='font-semibold'>{formatTime(time)}</h1>
        </div>

        <div className='flex items-start justify-start gap-4 py-4'>
            <img className='h-24 w-24 bg-amber-700 rounded-sm' src={imgPath} alt={type + ' meal image'} />
            <div>
                <h1 className='text-lg font-medium'>{mealName}</h1>
                <h1 className='text-black/50 font-semibold'>{calCount}</h1>
            </div>
        </div>
        
    </div>
  )
}

export default PlanningMealCard