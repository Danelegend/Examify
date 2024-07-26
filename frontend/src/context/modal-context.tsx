import { createContext } from "react";

export type ModalDisplayType = {
    login: boolean,
    register: boolean,
    feedback: boolean,
}

type ModalContextType = {
    Modal: ModalDisplayType,
    SetDisplayLogin: (display: boolean) => void
    SetDisplayRegister: (display: boolean) => void
    SetDisplayFeedback: (display: boolean) => void
}

export const ModalContext = createContext<ModalContextType>({
    Modal: {
        login: false,
        register: false,
        feedback: true
    },
    SetDisplayLogin: (display: boolean) => {},
    SetDisplayRegister: (display: boolean) => {},
    SetDisplayFeedback: (display: boolean) => {},
});