import Environment from "../../constants"

export type UserAuthentication = {
    refresh_token: string,
    access_token: string
}

export const signUp = async (first_name: string, last_name: string, email: string, password: string) => {
    const response = await fetch(Environment.BACKEND_URL + "/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        }),
        credentials: "include"
    })

    return response.json()
}