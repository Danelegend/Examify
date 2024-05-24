import { useContext } from "react";
import { Link } from "react-router-dom";
import { ModalContext } from "../../../context/modal-context";
import { NavigationButton } from "./NavButton";

const LoggedOutNavbar = () => {
    const { SetDisplayLogin, SetDisplayRegister } = useContext(ModalContext)

    const handleLoginClick = () => {
        SetDisplayLogin(true)
    }

    const handleRegisterClick = () => {
        SetDisplayRegister(true)
    }

    return (
        <>
                <div className="self-stretch justify-start items-center gap-5 inline-flex text-base font-['Montserrat']">
                    <NavigationButton link="/" title="About" />
                    <NavigationButton link="/exams" title="Exams" />
                    <NavigationButton link="/upload" title="Upload" />
                    <NavigationButton link="/contact" title="Contact" />
                </div>

                <div className="justify-start items-center inline-flex gap-10">
                    <div className="text-right text-sky-500 text-sm font-bold font-['Montserrat'] leading-7 tracking-tight cursor-pointer" onClick={handleLoginClick}>
                        Login
                    </div>
                    <div className="self-stretch px-[25px] py-[15px] bg-sky-500 rounded-[5px] justify-start items-center gap-[15px] flex cursor-pointer" onClick={handleRegisterClick}>
                        <div className="text-white text-sm font-bold font-['Montserrat'] leading-7 tracking-tight">Become a member</div>
                    </div>
                </div>
        </>
    )
}



export default LoggedOutNavbar;