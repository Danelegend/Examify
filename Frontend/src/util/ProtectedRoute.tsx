import { useQuery } from "@tanstack/react-query"
import Environment from "../../constants"
import { FetchError, readAccessToken } from "./utility"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"

export const ProtectedRoute = () => {
    const hasAccessToken = readAccessToken() !== null

    return (
        hasAccessToken ? <Outlet /> : <Navigate to="/" />
    )
}

export const AdminProtectedRoute = () => {
    const AccessToken = readAccessToken()
    
    const navigate = useNavigate()

    const fetchPermissions = () => {
        return fetch(Environment.BACKEND_URL + "/api/auth/permissions", {
            headers: { 
                'Authorization': `bearer ${AccessToken}`
            },
            method: 'GET',
            credentials: 'include'
        }).then(async res => {
            const data = await res.json()

            if (res.ok) {
                return data
            } else {
                throw new FetchError(res)
            }
        })
    }

    const { data, isPending, error } = useQuery({
        queryKey: ['Permissions'],
        queryFn: fetchPermissions
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