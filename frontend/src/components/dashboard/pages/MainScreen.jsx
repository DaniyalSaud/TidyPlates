import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import ReminderItem from '../components/ReminderItem';
import MealCard from '../components/MealCard';

function MainScreen() {
  const [selected, setSelected] = useState(new Date());

  return (
    <div className='overflow-y-auto h-full p-6 w-full'>
      <div className='greetings flex flex-col justify-center gap-1 pb-4'>
        <h1 className='text-2xl font-semibold'>Welcome, User</h1>
        <p className='text-black/60'>Check out your personalized meals</p>
      </div>

      <div className='flex items-center gap-6'>
        <div className='calendar flex flex-col items-center justify-start px-4 pt-4 h-[24rem] bg-slate-200 rounded-md'>
          <h1 className='text-xl font-medium'>Today's meal plan</h1>
          <Calendar 
          selected={selected}
          mode='single'
          fromMonth={selected}
          toMonth={selected}/>
        </div>

        <div className='reminders grow bg-slate-200 rounded-md h-[24rem] p-4'>
          <h1 className='text-xl font-medium pb-2'>Reminders</h1>
          <div className='reminders-list flex flex-col gap-2 p-4 overflow-y-auto h-[20rem]'>
            <ReminderItem reminderText={'Take medication'} reminderTime={'12:00 PM'}/>
            <ReminderItem reminderText={'Check blood pressure'} reminderTime={'12:00 PM'}/>
            <ReminderItem reminderText={'Monitor glucose level'} reminderTime={'12:00 PM'}/>
          </div>
        </div>

      </div>

      <div className='meal-plan mt-6 bg-slate-100 h-72 rounded-md w-full flex flex-col gap-3 p-4'>
        <h1 className='text-xl font-medium bg-amber-600'>
          Today's Meal Plan
        </h1>
        <div className='h-full flex items-center gap-6 w-full overflow-x-auto'>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'}/>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'}/>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'}/>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'}/>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'}/>
          <MealCard type={'Breakfast'} mealName={"Oatmeal"} mealPath={'Unknown'} mealNutrition={'20 Cal | 60g Protein'} cookTime={'20 min'}/>
        </div>
      </div>

      <div className='flex justify-center items-center gap-6 pt-4'>
        <div className='h-56 bg-slate-100 w-96'>
          <h1>Nutritional Breakdown</h1>
        </div>
        <div className='h-56 bg-slate-100 w-96'>
          Weekly Progress
        </div>
      </div>

    </div>
  )
}

export default MainScreen