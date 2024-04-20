import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Environment from "../../../../constants";
import { readAccessToken, removeAccessToken } from "../../../util/utility";
import { useContext } from "react";
import { UserContext } from "../../../context/user-context";
import { NavigationButton } from "./NavButton";

const LoggedInNavbar = () => {
    const { setAccessToken } = useContext(UserContext)

    const navigate = useNavigate()

    const handleLogoutClick = () => {
        try {
            LogoutMutation()
        } catch (e) {
            console.error(e)
        }
    }

    const { mutateAsync: LogoutMutation } = useMutation<Response>({
        mutationFn: () => {
            return fetch(Environment.BACKEND_URL + "/api/auth/logout", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + readAccessToken()
                },
                method: "DELETE",
                credentials: 'include'
            })
        },
        onSuccess: () => {
            removeAccessToken()
            setAccessToken(null)
            navigate("/")
        },
    })

    return (
        <div>
            <div className="flex w-full h-1/5 left-0 top-0 bg-[#282828] justify-between items-center px-5">
                <div className="pl-7 py-5 justify-start items-center inline-flex">
                    <Link to="/">
                        <div className="text-neutral-200 text-2xl font-bold font-['Montserrat'] leading-loose tracking-tight cursor-pointer">
                            Examify
                        </div>
                    </Link>
                </div>

                <div className="self-stretch justify-start items-center gap-[21px] inline-flex text-base font-['Montserrat']">
                    <NavigationButton link="/dashboard" title="Home" />
                    <NavigationButton link="/exams" title="Exams" />
                    <NavigationButton link="/upload" title="Upload" />
                    <NavigationButton link="/contact" title="Contact" />
                </div>

                <div className="justify-start items-center inline-flex">
                    <div className="text-sky-500 text-sm font-bold font-['Montserrat'] leading-7 tracking-tight cursor-pointer pr-10 md:pr-12" onClick={handleLogoutClick}>
                        Logout
                    </div>
                </div>
            </div>
        </div>
    )
}



export default LoggedInNavbar;