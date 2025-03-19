import React from 'react'
import { NavLink } from 'react-router'

function NavigationItem({ route, img_path, title }) {
    return (
        <>
            <li>
                <NavLink className='rounded-lg flex flex-wrap items-center gap-4 h-10 hover:bg-slate-300 active:bg-slate-400/50 px-4 transition-all ease-in-out' to={route}>
                    <img className='h-6 w-6' src={img_path} alt="img here" />
                    <h1 className='text-sm font-semibold text-black/70'>{title}</h1>
                </NavLink>
            </li>
        </>
    )
}

export default NavigationItem