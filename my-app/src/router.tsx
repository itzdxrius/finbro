import Login from "./pages/Login"
import Register from "./pages/Register"
import Budget from "./pages/Budget"
import Dashboard from "./pages/Dashboard"
import Setting from "./pages/Setting"
import History from "./pages/History"
import {createBrowserRouter, Navigate} from "react-router-dom";

export const router = createBrowserRouter([
    {path:"/", element:<Navigate to="/dashboard" replace/>},
    {path:"/login", element:<Login/>},
    {path:"/dashboard", element:<Dashboard/>},
    {path:"/register", element:<Register/>},
    {path:"/budget", element:<Budget/>},
    {path:"/setting", element:<Setting/>},
    {path:"/history", element:<History/>}
]);