
import { useState } from "react";
import { ClickableButton, NavigationButton } from "./NavButton";
import LoginPopup from "../../Login";
import RegisterPopup from "../../Register";

const LoggedOutNavbar = () => {
    const [DisplayLogin, SetDisplayLogin] = useState(false) 
    const [DisplayRegister, SetDisplayRegister] = useState(false)

    const handleLoginPopupExit = () => {
        SetDisplayLogin(false)
    }

    const handleLoginClick = () => {
        SetDisplayLogin(true)
    }

    const handleRegisterPopupExit = () => {
        SetDisplayRegister(false)
    }

    const handleRegisterClick = () => {
        SetDisplayRegister(true)
    }

    return (
        <div>
            <div className="pt-3 pb-4">
                <div className="grid grid-cols-7 gap-4 justify-center pr-16 pl-10">
                    <div className="col-span-2 text-xl ">
                        Examify
                    </div>
                    <div className="col-start-5">
                        <NavigationButton title={"Exams"} link={"/exams"} />
                    </div>
                    <div className="col-start-6"> 
                        <ClickableButton title={"Login"} onClick={handleLoginClick} />
                    </div>
                    <div className="col-start-7">
                        <ClickableButton title={"Register"} onClick={handleRegisterClick}/>
                    </div>
                </div>
            </div>

            {DisplayLogin ? <LoginPopup onExit={handleLoginPopupExit} /> : null}
            {DisplayRegister ? <RegisterPopup onExit={handleRegisterPopupExit} /> : null}
        </div>
    )
}

export default LoggedOutNavbar;