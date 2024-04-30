import { Outlet } from "react-router-dom";
import { Header } from "./Components/Header";
import LoginPopup from "./Components/Authentication/Login";
import { useState } from "react";
import { ModalContext, ModalDisplayType } from "./context/modal-context";
import RegisterPopup from "./Components/Authentication/Register";

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
            <div className="bg-[#212121] min-h-screen min-w-screen">
                <Header />

                <Outlet />
                {
                    Modal.login ? <LoginPopup onExit={() => SetDisplayLogin(false)} /> : null
                }
                {
                    Modal.register ? <RegisterPopup onExit={() => SetDisplayRegister(false)} /> : null
                }
            </div>
        </ModalContext.Provider>
    )
}

export default Layout;