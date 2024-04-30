import { useContext } from "react";
import LoggedOutNavbar from "./Components/LoggedOutNavbar";
import { UserContext } from "../../context/user-context";
import LoggedInNavbar from "./Components/LoggedInNavbar";
import { useMutation } from "@tanstack/react-query";
import { GetTokenRefresh } from "../../api/api";
import { readExpiration, removeAccessToken, storeAccessToken, storeExpiration } from "../../util/utility";

const Navbar = () => {
    const { accessToken, setAccessToken } = useContext(UserContext);

    const { mutateAsync: CheckToken } = useMutation({
        mutationFn: GetTokenRefresh,
        onSuccess: (res) => {
            res.json().then((data) => {
                switch (res.status) {
                    case 200:
                        storeAccessToken(data.access_token)
                        storeExpiration(data.expiration)
                        break
                    default:
                        removeAccessToken()
                        setAccessToken(null)
                }
            })
        }
    })

    if (readExpiration() !== null && new Date(readExpiration()!) < new Date()) {
        CheckToken()
    }

    return (
        accessToken === null ? <LoggedOutNavbar /> : <LoggedInNavbar /> 
    )
}

export default Navbar;