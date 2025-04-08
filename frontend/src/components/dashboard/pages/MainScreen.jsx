import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import ReminderItem from '../components/ReminderItem';
import MealCard from '../components/MealCard';

function MainScreen() {
  const [selected, setSelected] = useState(new Date());

  return (
    <div className='overflow-y-auto h-full p-6 grow'>
      <div className='greetings flex flex-col justify-center gap-1 pb-4'>
        <h1 className='text-2xl font-semibold'>Welcome, User</h1>
        <p className='text-black/60'>Check out your personalized meals</p>
      </div>

      <div className='flex items-center gap-6'>
        <div className='calendar flex flex-col items-center justify-start px-4 pt-4 h-[24rem] w-[24rem] bg-slate-200 rounded-md'>
          <h1 className='text-xl font-medium'>Today's meal plan</h1>
          <Calendar
            selected={selected}
            mode='single'
            fromMonth={selected}
            toMonth={selected} />
        </div>

        <div className='reminders grow bg-slate-200 rounded-md h-[24rem] p-4'>
          <h1 className='text-xl font-medium pb-2'>Reminders</h1>
          <div className='reminders-list flex flex-col gap-2 p-4 overflow-y-auto h-[20rem]'>
            <ReminderItem reminderText={'Take medication'} reminderTime={'12:00 PM'} />
            <ReminderItem reminderText={'Check blood pressure'} reminderTime={'12:00 PM'} />
            <ReminderItem reminderText={'Monitor glucose level'} reminderTime={'12:00 PM'} />
          </div>
        </div>

      </div>

      <div className='meal-plan mt-6 bg-slate-100 h-72 rounded-md w-full flex flex-col gap-3 p-4'>
        <h1 className='text-xl font-medium'>
          Today's Meal Plan
        </h1>
        <div className='h-full flex items-center justify-around gap-x-2 overflow-x-auto'>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'} />
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'} />
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'} />
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'} />
        </div>
      </div>

      <div className='flex justify-center items-center gap-6 pt-4'>
        <div className='h-56 bg-slate-100 w-96 rounded-md bg px-4 py-2'>
          <h1 className='text-lg font-medium'>Nutritional Breakdown</h1>
          <div className='progress-bars flex flex-col gap-2 pt-6 px-2'>
            <div className='flex items-center justify-between gap-4'>
              <h1 className='w-20 text-sm font-medium text-black/70'>Calories</h1>
              <div className='flex items-center gap-3 w-full'>
                <Progress value={50} ProgressColor={'bg-indigo-900'} />
                <h1 className='text-xs font-light text-black/60'>{}/2000Cal</h1>
              </div>

            </div>
            <div className='flex items-center gap-4'>
              <h1 className='w-20 text-sm font-medium text-black/70'>Protein</h1>
              <div className='flex items-center gap-3 w-full'>
                <Progress value={50} ProgressColor={'bg-indigo-900'} />
                <h1 className='text-xs font-light text-black/60'>{}/120g</h1>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <h1 className='w-20 text-sm font-medium text-black/70'>Carbs</h1>
              <div className='flex items-center gap-3 w-full'>
                <Progress value={50} ProgressColor={'bg-indigo-900'} />
                <h1 className='text-xs font-light text-black/60'>{}/300g</h1>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <h1 className='w-20 text-sm font-medium text-black/70'>Fats</h1>
              <div className='flex items-center gap-3 w-full'>
                <Progress value={50} ProgressColor={'bg-indigo-900'} />
                <h1 className='text-xs font-light text-black/60'>{}/50g</h1>
              </div>
            </div>
          </div>
        </div>
        <div className='h-56 bg-slate-100 w-96 rounded-md'>
          Weekly Progress
        </div>
      </div>

    </div>
  )
}

export default MainScreen