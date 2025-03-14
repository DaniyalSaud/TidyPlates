import React, { useState } from 'react'
import SignupProgress from './SignUp Form Components/SignupProgress';
import './SignUpForm.css'
import SignUpBasic from './SignUp Form Components/SignUpBasic';
import SignUpHealth from './SignUp Form Components/SignUpHealth';
import SignUpPreference from './SignUp Form Components/SignUpPreference';


function SignUpForm() {
    const [formPage, setFormPage] = useState(0); // There will be 3 steps in a sign up form [0, 1, 2]

    const formToDisplay = () => {
        if (formPage === 0) {
            return <SignUpBasic setFormPage={setFormPage}/>
        } else if (formPage === 1) {
            return <SignUpHealth setFormPage={setFormPage} />
        } else if (formPage === 2) {
            return <SignUpPreference setFormPage={setFormPage} />
        }
    }


    return (
        <>
            <div>
                <SignupProgress formPage={formPage} />
                <div>{formToDisplay()}</div>
            </div>
        </>
    )
}

export default SignUpForm