import React from 'react'
import { NavLink } from 'react-router'

function NavigationItem({ route, img_path, title }) {
    return (
        <>
            <li>
                <NavLink className='rounded-lg flex flex-wrap items-center gap-4 h-12 hover:bg-slate-300 active:bg-slate-400/50 px-4 transition-all ease-in-out' to={route}>
                <div className='bg-white p-1 rounded-lg nav-icon-shadow flex justify-center items-center'>
                    <img className='h-6 w-6' src={img_path} alt="img here" />
                </div>
                    <h1 className='text-sm font-semibold text-black/70'>{title}</h1>
                </NavLink>
            </li>
        </>
    )
}

export default NavigationItem