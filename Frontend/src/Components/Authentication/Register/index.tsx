import { useState } from "react";
import RegistrationScreen1 from "./Components/Screen1";
import RegistrationScreen2 from "./Components/Screen2";

type RegisterPopupProps = {
    onExit: () => void,
}

const RegisterPopup = ({ onExit }: RegisterPopupProps) => {
    const [CurrentScreen, SetCurrentScreen] = useState<number>(1)

    const ChangeScreen = () => {
        if (CurrentScreen === 1) {
            SetCurrentScreen(2)
        }
    }

    return (
        <div className="fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Sign Up
                        </h3>
                        <button type="button" onClick={onExit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <div className="text-xl">
                                x
                            </div>
                        </button>
                    </div>

                    {
                        (CurrentScreen === 1) ? 
                        <RegistrationScreen1 changeScreen={ChangeScreen} />
                        : 
                        <RegistrationScreen2 />
                    }
                </div>
            </div>
        </div> 
    )
}

export default RegisterPopup