import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import PlanningMealCard from '../components/PlanningMealCard';
import TodayMacro from '../components/TodayMacro';

function ScheduleScreen() {
    const handleGlassIncrement = () => {
        const maxGlasses = 10; // Assuming 10 glasses is the maximum for a day
        setGlasses((prev) => (prev < maxGlasses ? prev + 1 : prev));
    }

    const handleGlassDecrement = () => {
        setGlasses((prev) => (prev > 0 ? prev - 1 : prev));
    }

    const getTodayDayName = () => {
        const date = new Date();
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options).toLowerCase();
    }

    const getGlassPercentage = (glasses) => {
        const maxGlasses = 10; // Assuming 10 glasses is the maximum for a day
        return (glasses / maxGlasses) * 100;
    }

    const [selectedDay, setSelectedDay] = React.useState(getTodayDayName());
    const [glasses, setGlasses] = React.useState(0);

    return (
        <div className='overflow-y-auto h-full p-6 grow flex flex-col gap-6'>
            <div className='flex flex-col gap-6'>
                <h1 className='text-2xl font-semibold'>Weekly Meal Schedule</h1>
                <div className='days'>
                    <ToggleGroup type='single' defaultValue={selectedDay}>
                        <ToggleGroupItem value='monday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Mon</ToggleGroupItem>
                        <ToggleGroupItem value='tuesday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Tue</ToggleGroupItem>
                        <ToggleGroupItem value='wednesday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Wed</ToggleGroupItem>
                        <ToggleGroupItem value='thursday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Thur</ToggleGroupItem>
                        <ToggleGroupItem value='friday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Fri</ToggleGroupItem>
                        <ToggleGroupItem value='saturday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Sat</ToggleGroupItem>
                        <ToggleGroupItem value='sunday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>Sun</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>

            <div className='flex items-start justify-between gap-8 pl-10'>
                <div className='grid 2xl:grid-cols-2 xl:grid-cols-1 gap-x-8 gap-y-6'>
                    <PlanningMealCard time={'14:00'} type={'Breakfast'} calCount={'100 KCal'} mealName={'Quinoa'} />
                    <PlanningMealCard time={'14:00'} type={'Breakfast'} calCount={'100 KCal'} mealName={'Quinoa'} />
                    <PlanningMealCard time={'14:00'} type={'Breakfast'} calCount={'100 KCal'} mealName={'Quinoa'} />
                    <PlanningMealCard time={'14:00'} type={'Breakfast'} calCount={'100 KCal'} mealName={'Quinoa'} />
                </div>

                <div className='flex flex-col items-center justify-center gap-4'>
                    <TodayMacro protein={65} carbs={30} fats={70} />

                    <div className='h-60 w-96 bg-slate-100 rounded-md px-4 py-3 flex flex-col items-start justify-start gap-1'>
                        <div>
                            <h1 className='text-xl font-medium'>Hydration</h1>
                        </div>
                        <div className='flex items-center justify-center w-full h-full'>
                            <div className="radial-progress text-indigo-800 scale-[1.5]" style={{ "--value": getGlassPercentage(glasses) }} aria-valuenow={getGlassPercentage(glasses)} role="progressbar">
                                {getGlassPercentage(glasses)}%
                            </div>
                        </div>

                        <div className='flex items-center justify-between w-full'>
                            <button className='h-10 w-10 text-2xl flex items-center justify-center font-medium rounded-full bg-gray-400' onClick={handleGlassDecrement}><h1>-</h1></button>
                            <button className='h-10 w-10 text-2xl flex items-center justify-center font-medium rounded-full bg-gray-400' onClick={handleGlassIncrement}><h1>+</h1></button>
                        </div>
                    </div>
                </div>

            </div>



        </div>
    )
}

export default ScheduleScreen