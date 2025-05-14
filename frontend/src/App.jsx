import { StrictMode, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpForm from "./components/SignUp Form/SignUpForm";
import LandingPage from "./components/Landing Page/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";
import MainScreen from "./components/dashboard/pages/MainScreen";
import './main.css'
import PlanningScreen from "./components/dashboard/pages/PlanningScreen";
import ScheduleScreen from "./components/dashboard/pages/ScheduleScreen";
import LoginPage from "./components/Login Page/LoginPage";
import { LoggedInContext, UserIDContext } from "./contexts/loginContext";

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/signup',
        element: <SignUpForm />
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
            // {
            //   path: '',
            //   element: <h1 className="text-center text-6xl font-semibold h-screen flex items-center justify-center">There is no content here.</h1>
            // },
            {
                path: 'main',
                element: <MainScreen />
            },
            {
                path: 'planning',
                element: <PlanningScreen />
            },
            {
                path: 'schedule',
                element: <ScheduleScreen />
            },
            {
                path: 'grocery',
                element: <h1>Grocery Tab</h1>
            },
        ]
    }
]);

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userID, setUserID] = useState(0);
    
    return (
        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
            <UserIDContext.Provider value={{ userID, setUserID }}>
                <RouterProvider router={router} />
            </UserIDContext.Provider>
        </LoggedInContext.Provider>
    );
}


export default App;
