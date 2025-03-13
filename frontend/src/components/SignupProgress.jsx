import React from 'react'

const SignupProgress = () => {
    return (
        <>
            <div className="sign-up-progress flex justify-center items-center gap-4 pt-6 pb-4">
                <div className="w-14 h-14 bg-gray-300 rounded-full flex justify-center items-center">
                    <h1 className="font-semibold text-lg">1</h1>
                </div>
                <div className="w-1/3 h-2 rounded-full bg-gray-300"></div>
                <div className="w-14 h-14 bg-gray-300 rounded-full flex justify-center items-center">
                    <h1 className="font-semibold text-lg">2</h1>
                </div>
                <div className="w-1/3 h-2 rounded-full bg-gray-300"></div>
                <div className="w-14 h-14 bg-gray-300 rounded-full flex justify-center items-center">
                    <h1 className="font-semibold text-lg">3</h1>
                </div>
            </div>
        </>
    )
}


export default SignupProgress;