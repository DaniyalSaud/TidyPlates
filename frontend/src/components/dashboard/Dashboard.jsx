import React from 'react'
import NavigationMenu from './components/NavigationMenu'
import { Outlet } from 'react-router'
import './dashboard.css'

function Dashboard() {
  return (
    <>
      <div className='h-screen flex'>
        <NavigationMenu />
        <Outlet />

      </div>
    </>
  )
}

export default Dashboard