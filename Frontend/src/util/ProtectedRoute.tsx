import { readAccessToken } from "./utility"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
    const hasAccessToken = readAccessToken() !== null

    return (
        hasAccessToken ? <Outlet /> : <Navigate to="/" />
    )
}

export default ProtectedRoute;