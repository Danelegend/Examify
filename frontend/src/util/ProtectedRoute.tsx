import { useQuery } from "@tanstack/react-query"
import { readAccessToken } from "./utility"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { FetchPermissions } from "../api/api"

export const ProtectedRoute = () => {
    const hasAccessToken = readAccessToken() !== null

    return (
        hasAccessToken ? <Outlet /> : <Navigate to="/" />
    )
}

export const AdminProtectedRoute = () => {
    const navigate = useNavigate()

    const { data, isPending, error } = useQuery({
        queryKey: ['Permissions'],
        queryFn: () => FetchPermissions()
    })

    useEffect(() => {
        if (!isPending) {
            if (error) {
                console.log(error)
                navigate("/")
            } 
        }
    }, [data, isPending, error])

    return isPending ? <div> Loading... </div> :
    (data?.permissions === 'ADM' ? <Outlet /> : <Navigate to="/" />)

}