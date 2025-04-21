import React from 'react'
import NavigationItem from './NavigationItem'
import { NavLink } from 'react-router'
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

function NavigationMenu() {
  return (
    <>
      <nav className='bg-slate-200 h-screen min-w-64 px-6 py-6'>
        <div className='flex items-center gap-4 pb-10'>
          <div className='brand-logo'>
            <img src="" className='h-10 w-10' alt="tidyplates logo here" />
          </div>
          <NavLink to='main' className='brand-name text-2xl font-semibold text-indigo-900'>TidyPlates</NavLink>
        </div>

        <div>

          <ul className='flex flex-col gap-2'>
            <NavigationItem route='main' title='Dashboard'>
              <BarChartIcon className='text-black/70' fontSize='small'/>
            </NavigationItem>
            <NavigationItem route='planning' title='Meal Planning'>
              <CalendarTodayOutlinedIcon className='text-black/70' fontSize='small' />
            </NavigationItem>
            <NavigationItem route='schedule' title='Scheduling'>
              <AccessTimeOutlinedIcon className='text-black/70' fontSize='small' />
            </NavigationItem>
            <NavigationItem route='grocery' title='Grocery List'>
              <ShoppingCartOutlinedIcon className='text-black/70' fontSize='small' />
            </NavigationItem>
          </ul>

        </div>
      </nav>

    </>
  )
}

export default NavigationMenu