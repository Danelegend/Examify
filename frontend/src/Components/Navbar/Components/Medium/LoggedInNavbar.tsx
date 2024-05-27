import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { readAccessToken, removeAccessToken } from "../../../../util/utility";
import { useContext } from "react";
import { UserContext } from "../../../../context/user-context";
import { NavigationButton } from "../NavButton";
import { UserLogout } from "../../../../api/api";

const LoggedInNavbar = () => {
    const { setAccessToken } = useContext(UserContext)

    const navigate = useNavigate()

    const handleLogoutClick = () => {
        try {
            LogoutMutation({
                token: readAccessToken()!
            })
        } catch (e) {
            console.error(e)
        }
    }

    const { mutateAsync: LogoutMutation } = useMutation({
        mutationFn: UserLogout,
        onSuccess: () => {
            removeAccessToken()
            setAccessToken(null)
            navigate("/")
        },
    })

    return (
        <>
                <div className="self-stretch justify-start items-center gap-[21px] inline-flex text-base font-['Montserrat']">
                    <NavigationButton link="/dashboard" title="Dashboard" />
                    <NavigationButton link="/exams" title="Exams" />
                    <NavigationButton link="/upload" title="Upload" />
                    <NavigationButton link="/contact" title="Contact" />
                </div>

                <div className="justify-start items-center inline-flex">
                    <div className="text-sky-500 text-sm font-bold font-['Montserrat'] leading-7 tracking-tight cursor-pointer pr-10 md:pr-12" onClick={handleLogoutClick}>
                        Logout
                    </div>
                </div>
        </>
    )
}



export default LoggedInNavbar;