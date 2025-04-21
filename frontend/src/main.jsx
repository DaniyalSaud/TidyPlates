import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpForm from "./components/SignUp Form/SignUpForm";
import LandingPage from "./components/Landing Page/LandingPage";
import Dashboard from "./components/dashboard/Dashboard";
import NavigationMenu from "./components/dashboard/components/NavigationMenu";
import MainScreen from "./components/dashboard/pages/MainScreen";
import './main.css'
import PlanningScreen from "./components/dashboard/pages/PlanningScreen";
import ScheduleScreen from "./components/dashboard/pages/ScheduleScreen";


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

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
