import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { readAccessToken, removeAccessToken } from "../../../../util/utility";
import { useContext } from "react";
import { UserContext } from "../../../../context/user-context";
import { NavigationButton } from "../NavButton";
import { UserLogout } from "../../../../api/api";
import NotificationIcon from "../Notification";

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
                <div className="self-stretch justify-start items-center gap-7 inline-flex text-base font-['Montserrat']">
                    <NavigationButton link="/dashboard" title="Dashboard" />
                    <NavigationButton link="/exams" title="Exams" dropLinks={
                        [
                            {
                                title: "All",
                                link: "/exams"
                            },
                            {
                                title: "Maths EX2",
                                link: "/exams/maths extension 2"
                            },
                            {
                                title: "Maths Advanced",
                                link: "/exams/maths advanced"
                            },
                            {
                                title: "Chemistry",
                                link: "/exams/chemistry"
                            },
                            {
                                title: "Economics",
                                link: "/exams/economics"
                            }
                            
                        ]
                    }/>
                    <NavigationButton link="/questions" title="Questions" />
                    <NavigationButton link="/tutor" title="Tutor AI" />
                    <NavigationButton link="/blogs" title="Articles" />
                    <NavigationButton link="/upload" title="Upload" />
                </div>

                <div className="justify-start items-center inline-flex space-x-4">
                    <NotificationIcon />
                    <div className="text-sky-500 text-sm font-bold font-['Montserrat'] leading-7 tracking-tight cursor-pointer pr-10 md:pr-12" onClick={handleLogoutClick}>
                        Logout
                    </div>
                </div>
        </>
    )
}



export default LoggedInNavbar;