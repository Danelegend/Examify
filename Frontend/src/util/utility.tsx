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

export const storeExpiration = (exp: string) => {
    store("expiration", exp)
}

export const readAccessToken = () => {
    return get("access_token")
}

export const readExpiration = () => {
    return get("expiration")
}

export const haveAccessToken = () => {
    const exp = readExpiration()

    return readAccessToken() !== null && exp !== null && new Date(exp) <= new Date()
}

export const removeAccessToken = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("expiration")
}

type AuthClientMiddleWareType = (done: () => Promise<Response>) => () => Promise<Response>

export const authClientMiddleWare: AuthClientMiddleWareType = (done) => {
    // Check if the user's token is expired
    const exp = readExpiration()

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
                        navigate("/")
                        break
                    case 200:
                        storeAccessToken(data.access_token)
                        storeExpiration(data.expiration)
                        setAccessToken(data.access_token)
                        break
                    default:
                        break
                }
            })
        },
        onError: (e) => {
            console.log(e)
        },
        retry: false
    })

    return () => {
        if (exp === null || new Date(exp) <= new Date()) {
            RefreshTokenMutation()
        } 
        
        if (readAccessToken() === null) {
            return new Promise<Response>(() => {})
        } 

        return done()
    }
}

export class FetchError extends Error {
    constructor(public res: Response, message?: string) {
        super(message)
    }

    get status() {
        return this.res.status
    }
}