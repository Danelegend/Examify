import { Outlet } from "react-router-dom";
import { Header } from "./Components/Header";
import LoginPopup from "./Components/Authentication/Login";
import { useState } from "react";
import { ModalContext, ModalDisplayType } from "./context/modal-context";
import RegisterPopup from "./Components/Authentication/Register";
import Footer from "./Components/Footer";

const Layout = () => {
    const [Modal, SetModal] = useState<ModalDisplayType>({
        login: false,
        register: false,
    })

    const SetDisplayLogin = (display: boolean) => {
        SetModal({
            login: display,
            register: Modal.register,
        })
    }

    const SetDisplayRegister = (display: boolean) => {
        SetModal({
            login: Modal.login,
            register: display,
        })
    }

    return (
        <ModalContext.Provider value={{ Modal, SetDisplayLogin, SetDisplayRegister }}>
            <div className="bg-[#F3F5F8] min-h-screen min-w-screen flex flex-col justify-between">
                <Header />

                <Outlet />
                {
                    Modal.login ? <LoginPopup onExit={() => SetDisplayLogin(false)} /> : null
                }
                {
                    Modal.register ? <RegisterPopup onExit={() => SetDisplayRegister(false)} /> : null
                }
                <Footer />
            </div>
            
        </ModalContext.Provider>
    )
}

export default Layout;