import React from 'react'

const SignupProgress = ({formPage}) => {
    return (
        <>
            <div className="sign-up-progress flex justify-center items-center gap-4 pt-6 pb-4">
                <div className={formPage >= 0 ? "transition-all duration-300  ease-in-out w-14 h-14 bg-gray-700 rounded-full flex justify-center items-center" : "transition-all duration-300  ease-in-out w-14 h-14 bg-gray-300 rounded-full flex justify-center items-center"}>
                    <h1 className={formPage >= 0 ? "transition-all duration-300  ease-in-out font-semibold text-lg text-white" : "transition-all duration-300  ease-in-out font-semibold text-lg text-black"}>1</h1> 
                </div>
                <div className={formPage > 0 ? "transition-all duration-300  ease-in-out w-1/3 h-2 rounded-full bg-gray-700" : "transition-all duration-300  ease-in-out w-1/3 h-2 rounded-full bg-gray-300"} ></div>
                <div className={formPage > 0 ? "transition-all duration-300  ease-in-out w-14 h-14 bg-gray-700 rounded-full flex justify-center items-center" : "transition-all duration-300  ease-in-out w-14 h-14 bg-gray-300 rounded-full flex justify-center items-center"}>
                    <h1 className={formPage > 0 ? "transition-all duration-300  ease-in-out font-semibold text-lg text-white" : "transition-all duration-300  ease-in-out font-semibold text-lg text-black"}>2</h1> 
                </div>
                <div className={formPage === 2 ? "transition-all duration-300  ease-in-out w-1/3 h-2 rounded-full bg-gray-700" : "transition-all duration-300  ease-in-out w-1/3 h-2 rounded-full bg-gray-300"} ></div> 
                <div className={formPage === 2 ? "transition-all duration-300  ease-in-out w-14 h-14 bg-gray-700 rounded-full flex justify-center items-center" : "transition-all duration-300  ease-in-out w-14 h-14 bg-gray-300 rounded-full flex justify-center items-center"}>
                    <h1 className={formPage === 2 ? "transition-all duration-300  ease-in-out font-semibold text-lg text-white" : "transition-all duration-300  ease-in-out font-semibold text-lg text-black"}>3</h1>
                </div>
            </div>
        </>
    )
}


export default SignupProgress;