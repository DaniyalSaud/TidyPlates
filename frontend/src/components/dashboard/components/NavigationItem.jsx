import React from 'react'
import { NavLink } from 'react-router'

function NavigationItem({ route, title, children }) {
    const NavItemStyle = (isActive) => {
        return isActive ?
            'rounded-lg flex flex-wrap items-center gap-4 h-12 bg-slate-300 active:bg-slate-400/50 px-4 transition-all ease-in-out text-blue-800 font-bold' :
            'rounded-lg flex flex-wrap items-center gap-4 h-12 hover:bg-slate-300 active:bg-slate-400/50 px-4 transition-all ease-in-out text-black/70 font-semibold'
    }

    return (
        <>
            <li>
                <NavLink className={({ isActive }) =>
                    [
                        NavItemStyle(isActive)
                    ]
                } to={route}>
                    <div className='bg-white p-1 h-8 w-8 rounded-lg nav-icon-shadow flex justify-center items-center'>
                        {children}
                    </div>
                    <h1 className='text-sm'>{title}</h1>
                </NavLink>
            </li>
        </>
    )
}

export default NavigationItem