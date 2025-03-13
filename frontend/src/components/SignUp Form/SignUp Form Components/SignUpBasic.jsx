import React from 'react'

function SignUpBasic({setFormPage}) {
    return (
        <>
            <div className="top-info">
                <h1 className="text-3xl font-medium text-center">Set Up Your Profile</h1>
                <img src='/assets/restaurant.png' alt="Some icon" className="w-14 mx-auto pt-4 pb-4" />
            </div>

            <div className="basic-form-box bg-gray-300 rounded-lg mx-auto w-2/5 pt-8 pb-8 flex">
                <div className="w-92 pl-10 pr-10">
                    <form action="index.html" method="post">
                        <h1 className="text-2xl font-bold pb-8">Basic Information</h1>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-1">
                                <label className="pl-1 font-semibold" for="username">Username</label>
                                <input type="text" name="name" id="name" className="input-field bottom-shadow" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="pl-1 font-semibold" for="email">Email</label>
                                <input type="email" name="email" id="email" className="input-field bottom-shadow" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="pl-1 font-semibold" for="password">Password</label>
                                <input type="password" name="password" id="password" className="input-field bottom-shadow" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="pl-1 font-semibold" for="confirm-password">Confirm Password</label>
                                <input type="password" name="confirm-password" id="confirm-password"
                                    className="input-field bottom-shadow" required />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="pl-1 font-semibold" for="phone">Phone Number</label>
                                <input type="tel" name="phone" id="phone" className="input-field bottom-shadow" required />
                            </div>

                            <a className="text-sm hover:text-blue-900 hover:underline pl-1" href="#">Already have an account? Sign in</a>

                            <div className="pt-4 ml-auto">
                                <button onClick={()=>{setFormPage(curr => curr + 1);
                                     window.scrollTo({ top: 0, behavior: "smooth" });
                                }} type="submit" className="bg-white bottom-shadow h-10 rounded-lg w-20 hover:bg-gray-200 transition duration-100 ease-in-out active:bg-gray-300 cursor-pointer">Continue</button>
                            </div>

                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUpBasic