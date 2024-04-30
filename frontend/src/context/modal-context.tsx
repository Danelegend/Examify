import { createContext } from "react";

export type ModalDisplayType = {
    login: boolean,
    register: boolean,
}

type ModalContextType = {
    Modal: ModalDisplayType,
    SetDisplayLogin: (display: boolean) => void
    SetDisplayRegister: (display: boolean) => void
}

export const ModalContext = createContext<ModalContextType>({
    Modal: {
        login: false,
        register: false,
    },
    SetDisplayLogin: (display: boolean) => {},
    SetDisplayRegister: (display: boolean) => {},
});