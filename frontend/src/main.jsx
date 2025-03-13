import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUp from "./routes/SignUp";
import SignUpHealth from "./routes/SignUpHealth";
import SignUpBasic from "./routes/SignUpBasic";




const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Hello From Home</h1>,
  },
  {
    path: "/signup",
    element: <SignUp />, // Parent route
    children: [
      {
        path: "basic",
        element: <SignUpBasic />,
      },
      {
        path: "health",
        element: <SignUpHealth />,
      },
      {
        path: "preferences",
        element: <h1>Signup Preferences</h1>,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
