import React, { useEffect } from 'react'
import NavigationMenu from './components/NavigationMenu'
import { Outlet, useNavigate } from 'react-router'
import './dashboard.css'
import { GlassContext } from '../../contexts/hydrationContext'
import { LoggedInContext } from '../../contexts/loginContext'

function Dashboard() {
  const [glasses, setGlasses] = React.useState(0);
  const navigate = useNavigate();
  const {loggedIn} = React.useContext(LoggedInContext);
  console.log("LoggedIn: ", loggedIn);
  
  useEffect(() => {
    if (loggedIn === false) {
      navigate('/login');
    } else {
      navigate('/dashboard/main');
    }
  }, []);


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