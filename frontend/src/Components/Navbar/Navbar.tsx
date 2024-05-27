import { useContext, useState } from "react";
import LoggedOutNavbar from "./Components/Medium/LoggedOutNavbar";
import { UserContext } from "../../context/user-context";
import LoggedInNavbar from "./Components/Medium/LoggedInNavbar";
import { useMutation } from "@tanstack/react-query";
import { GetTokenRefresh } from "../../api/api";
import { readExpiration, removeAccessToken, storeAccessToken, storeExpiration } from "../../util/utility";
import { Link } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { MdMenu } from "react-icons/md";

type NavigationType = {
    title: string,
    link: string
} 

const NAVIGATION_OPTIONS: Array<NavigationType> = [
    {
        title: "Home",
        link: "/"
    },
    {
        title: "Exams",
        link: "/exams"
    },
    {
        title: "Upload",
        link: "/upload"
    },
    {
        title: "Contact Us",
        link: "/contact"
    },
    {
        title: "Login",
        link: "/login"
    },
    {
        title: "Sign Up",
        link: "/register"
    }
]

const SmallNavbar = ({ accessToken }: { accessToken: string | null }) => {
    const [isMenuOpen, SetMenuOpen] = useState<boolean>(false);

    const handleLoginClick = () => {

    }

    const handleLogoutClick = () => {

    }

    return (
        <>
        <div className="flex w-full h-1/5 left-0 top-0 bg-slate-100 shadow-xl justify-between py-2 px-1">
            <div className="justify-center my-auto">
                <MdMenu size={"48"} color="black" onClick={() => SetMenuOpen(!isMenuOpen)}/>
            </div>
            <Link to="/" className="my-auto">
                <div className="text-neutral-700 text-2xl font-bold font-['Montserrat'] leading-loose tracking-tight cursor-pointer">
                    Examify
                </div>
            </Link>
            {
                accessToken === null ? 
                <div className="self-stretch px-[25px] py-[15px] bg-sky-500 rounded-[5px] justify-start items-center gap-[15px] flex cursor-pointer" onClick={handleLoginClick}>
                    <div className="text-white text-sm font-bold font-['Montserrat'] leading-7 tracking-tight">Login</div>
                </div>
                :
                <div className="self-stretch px-[25px] py-[15px] bg-sky-500 rounded-[5px] justify-start items-center gap-[15px] flex cursor-pointer" onClick={handleLogoutClick}>
                    <div className="text-white text-sm font-bold font-['Montserrat'] leading-7 tracking-tight">Logout</div>
                </div>
            }
        </div>
        <div className={(isMenuOpen ? "" : "hidden ") + ""}>
            <ul className="bg-slate-100 pt-2">
                {
                    NAVIGATION_OPTIONS.map((item, index) => {
                        return (
                            <Link key={index} to={item.link} className="text-neutral-700 hover:bg-blue-200">
                                <li key={index} className="pl-2 py-2 shadow-sm">
                                    {item.title}
                                </li>
                            </Link>
                        )
                    })
                }
            </ul>
        </div>
        </>
    )
}

const MediumNavbar = ({ accessToken }: { accessToken: string | null }) => {
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

const Navbar = () => {
    const size = useWindowSize()
    
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

    return (size.width >= 720) ? 
        <MediumNavbar accessToken={accessToken} />
        :
        <SmallNavbar accessToken={accessToken} />
}

export default Navbar;