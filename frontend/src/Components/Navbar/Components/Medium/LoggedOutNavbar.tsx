import { useContext } from "react";
import { ModalContext } from "../../../../context/modal-context";
import { NavigationButton } from "../NavButton";

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
                <div className="self-stretch justify-start items-center gap-7 inline-flex text-base font-['Montserrat']">
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
                    <NavigationButton link="/blogs" title="Articles" />
                    <NavigationButton link="/upload" title="Upload" />
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