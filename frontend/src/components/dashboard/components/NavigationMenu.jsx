import React from 'react'
import NavigationItem from './NavigationItem'
import { NavLink } from 'react-router'

function NavigationMenu() {
  return (
    <>
      <nav className='bg-slate-200 h-screen w-64 px-6 py-6'>
        <div className='flex items-center gap-4 pb-10'>
          <div className='brand-logo'>
            <img src="" className='h-10 w-10' alt="tidyplates logo here" />
          </div>
          <NavLink to='main' className='brand-name text-2xl font-semibold text-indigo-900'>TidyPlates</NavLink>
        </div>

        <div>

          <ul className='flex flex-col gap-2'>
            <NavigationItem route='main' title='Dashboard' img_path=''/>
            <NavigationItem route='planning' title='Meal Planning' img_path=''/>
            <NavigationItem route='schedule' title='Scheduling' img_path=''/>
            <NavigationItem route='grocery' title='Grocery List' img_path=''/>
          </ul>

        </div>
      </nav>

    </>
  )
}

export default NavigationMenu