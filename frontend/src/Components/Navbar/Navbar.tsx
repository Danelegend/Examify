import { useContext } from "react";
import LoggedOutNavbar from "./Components/LoggedOutNavbar";
import { UserContext } from "../../context/user-context";
import LoggedInNavbar from "./Components/LoggedInNavbar";
import { useMutation } from "@tanstack/react-query";
import { GetTokenRefresh } from "../../api/api";
import { readExpiration, removeAccessToken, storeAccessToken, storeExpiration } from "../../util/utility";
import { Link } from "react-router-dom";

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
        <div className="flex w-full h-1/5 left-0 top-0 bg-slate-100 justify-between items-center px-5 shadow-xl">
            <div className="pl-7 py-5 justify-start items-center inline-flex">
                    <Link to="/">
                        <div className="text-neutral-700 text-2xl font-bold font-['Montserrat'] leading-loose tracking-tight cursor-pointer">
                            Examify
                        </div>
                    </Link>
            </div>
            {
                accessToken === null ? <LoggedOutNavbar /> : <LoggedInNavbar /> 
            }
        </div>

        
    )
}

export default Navbar;