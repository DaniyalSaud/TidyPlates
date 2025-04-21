import React from 'react'
import NavigationMenu from './components/NavigationMenu'
import { Outlet } from 'react-router'
import './dashboard.css'
import { GlassContext } from '../../contexts/hydrationContext'

function Dashboard() {
  const [glasses, setGlasses] = React.useState(0);
  
  return (
    <GlassContext.Provider value={{glasses, setGlasses}}>
      <div className='h-screen flex'>
        <NavigationMenu />
        <Outlet />

      </div>
    </GlassContext.Provider>
  )
}

export default Dashboard