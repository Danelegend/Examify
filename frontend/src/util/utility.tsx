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

export const storeExpiration = (exp: Date) => {
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
    const { setAccessToken } = useContext(UserContext)

    localStorage.removeItem("access_token")
    localStorage.removeItem("expiration")

    setAccessToken(null)
}

export class FetchError extends Error {
    constructor(public res: Response, message?: string) {
        super(message)
    }

    get status() {
        return this.res.status
    }
}

export const handle403 = () => {
    const { setAccessToken } = useContext(UserContext)

    const navigate = useNavigate()

    return () => {
        setAccessToken(null)
        removeAccessToken()
        navigate("/")
    }
}