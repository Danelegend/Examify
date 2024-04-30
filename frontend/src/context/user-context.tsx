import { createContext } from "react";

type UserContextType = {
    accessToken: string | null,
    setAccessToken: (auth: string | null) => void
}

export const UserContext = createContext<UserContextType>({
    accessToken: null,
    setAccessToken: (accessToken) => {}
});