import { Outlet } from "react-router-dom";
import { Header } from "./Components/Header";
import LoginPopup from "./Components/Authentication/Login";
import { useState } from "react";
import { ModalContext, ModalDisplayType } from "./context/modal-context";
import RegisterPopup from "./Components/Authentication/Register";
import Footer from "./Components/Footer";
import FeedbackPopup from "./Components/Feedback";

export const ModalLayout = () => {
    const [Modal, SetModal] = useState<ModalDisplayType>({
        login: false,
        register: false,
        feedback: true,
    })

    const SetDisplayLogin = (display: boolean) => {
        SetModal({...Modal, login: display})
    }

    const SetDisplayRegister = (display: boolean) => {
        SetModal({...Modal, register: display})
    }

    const SetDisplayFeedback = (display: boolean) => {
        SetModal({...Modal, feedback: display})
    }

    return (
        <ModalContext.Provider value={{ Modal, SetDisplayLogin, SetDisplayRegister, SetDisplayFeedback }}>
            <div className="bg-[rgb(243,245,248)] flex flex-col justify-between">

                <Outlet />
                {
                    Modal.login ? <LoginPopup onExit={() => SetDisplayLogin(false)} /> : null
                }
                {
                    Modal.register ? <RegisterPopup onExit={() => SetDisplayRegister(false)} /> : null
                }
                {
                    Modal.feedback ? <FeedbackPopup onExit={() => SetDisplayFeedback(false)}/> : null
                }
            </div>
            
        </ModalContext.Provider>
    )
}

export const Layout = () => {
    return (
        <div className="bg-[rgb(243,245,248)] min-h-screen max-w-screen flex flex-col justify-between">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
