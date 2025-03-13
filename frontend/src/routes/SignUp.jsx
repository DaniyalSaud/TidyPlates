import { useState } from 'react'
import './SignUp.css'
import SignupProgress from '../components/SignupProgress'
import { Link, Outlet } from 'react-router'

function SignUp() {

  const [step, setStep] = useState(0)

  return (
    <>
      <SignupProgress step={step} />
      <Outlet />
    </>
  )
}

export default SignUp
