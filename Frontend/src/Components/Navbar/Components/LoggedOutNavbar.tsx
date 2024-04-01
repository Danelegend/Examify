import { useContext } from "react";
import { Link } from "react-router-dom";
import { ModalContext } from "../../../context/modal-context";

const LoggedOutNavbar = () => {
    const { SetDisplayLogin, SetDisplayRegister } = useContext(ModalContext)

    const handleLoginClick = () => {
        SetDisplayLogin(true)
    }

    const handleRegisterClick = () => {
        SetDisplayRegister(true)
    }

    const NavigationButton = ({ link, title }: { link: string, title: string}) => {
        return (
            <div className="">
                <Link to={link}>
                    <div className="text-center text-neutral-500 font-semibold  leading-normal tracking-tight cursor-pointer">
                        {title}
                    </div>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="flex w-full h-1/5 left-0 top-0 bg-zinc-300 justify-between items-center px-5">
                <div className="pl-7 py-5 justify-start items-center inline-flex">
                    <Link to="/">
                        <div className="text-slate-800 text-2xl font-bold font-['Montserrat'] leading-loose tracking-tight cursor-pointer">
                            Examify
                        </div>
                    </Link>
                </div>

                <div className="self-stretch justify-start items-center gap-[21px] inline-flex text-base font-['Montserrat']">
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
            </div>
        </div>
    )
}



export default LoggedOutNavbar;