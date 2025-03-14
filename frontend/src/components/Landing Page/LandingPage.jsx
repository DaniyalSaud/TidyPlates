import React from 'react'
import './LandingPage.css'
import { Link } from 'react-router'

function LandingPage() {
    return (
        <>
            <div>
                <div className='relative landing-top'>
                    <img className='absolute -z-10' src="./Landing Page Assets/landing-page-top.png" alt="landing-page-top-bg" />
                    <div className='flex justify-between items-center pt-4 w-2/3 pr-40'>
                        <h1 className="text-4xl font-semibold">TidyPlates</h1>
                        <div className="log-signin flex items-center gap-2">
                            <Link className='landing-button block hover:bg-gray-100 active:bg-gray-300' to="#">Login</Link>
                            <Link className='landing-button block border-2 border-figma-rose hover:bg-figma-rose/20 active:bg-figma-rose/40' to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </div>

                <div className='landing-mid'>
                    <img src="./Landing Page Assets/landing-page-mid.png" alt="landing-page-mid-bg" />
                </div>

            </div>


        </>
    )
}

export default LandingPage