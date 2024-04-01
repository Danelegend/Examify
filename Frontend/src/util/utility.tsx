import { useMutation } from "@tanstack/react-query";
import Environment from "../../constants";
import { RefreshTokenResponse } from "../api/types";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/user-context";

const store = (key: string, value: any) => {
    return localStorage.setItem(key, value)
}

const get = (key: string) => {
    return localStorage.getItem(key)
}

const clear = () => {
	localStorage.clear();
	return null;
};

export const storeAccessToken = (token: string) => {
    store("access_token", token)
}

export const readAccessToken = () => {
    return get("access_token")
}

export const haveAccessToken = () => {
    return readAccessToken() !== null
}

export const removeAccessToken = () => {
    localStorage.removeItem("access_token")
}

export const handleAuthenticationError = () => {
    // Attempt to get a new access token using the refresh token
    const { setAccessToken } = useContext(UserContext)

    const navigate = useNavigate()

    const { mutateAsync: RefreshTokenMutation } = useMutation<Response>({
        mutationFn: () => {
            return fetch(Environment.BACKEND_URL + "/api/auth/refresh", {
                method: "GET",
                credentials: 'include'
            })
        },
        onSuccess: (res) => {
            res.json().then((data: RefreshTokenResponse) => {
                switch (res.status) {
                    case 500:
                        break
                    case 403:
                        setAccessToken(null)
                        clear()
                        // Reroute to home
                        navigate("/")
                        break
                    case 200:
                        storeAccessToken(data.access_token)
                        setAccessToken(data.access_token)
                        window.location.reload()
                        break
                    default:
                        break
                }
            })
        },
        onError: (e) => {
            console.log(e)
        }
    })

    return RefreshTokenMutation
}

export class FetchError extends Error {
    constructor(public res: Response, message?: string) {
        super(message)
    }

    get status() {
        return this.res.status
    }
}