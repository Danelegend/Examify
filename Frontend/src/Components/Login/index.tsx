import Environment from "../../../constants"

import { useContext, useState } from "react";
import styled from "styled-components";

type LoginPopupProps = {
    onExit: () => void,
}

const StyledInput = styled.input`
    padding: 6px
    `;

const LoginPopup = ({ onExit }: LoginPopupProps) => {
    const [Email, SetEmail] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    
    const [ResponseMessage, SetResponseMessage] = useState<string | null>(null)

    const handleEmailChange = (e) => {
        SetEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        SetPassword(e.target.value);
    }

    const handleLogin = async (email: string, password: string) => {
        const login_response = await (
            await fetch(Environment.BACKEND_URL + "/api/user/login",
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'include'
            })
        ).json()

        const id = login_response.user_id

        if (id === -1) {
            SetResponseMessage(login_response.message)
        }
    }

    const handleSubmission = () => {
        handleLogin(Email, Password)
    }

    return (
        <div className="fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Login
                        </h3>
                        <button type="button" onClick={onExit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <div className="text-xl">
                                x
                            </div>
                        </button>
                    </div>

                    <form className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-1">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" onChange={handleEmailChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Email" />
                            </div>
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" onChange={handlePasswordChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Password" />
                            </div>

                            {
                                (ResponseMessage === null) ? null : 
                                <div className="text-red-600">
                                    {ResponseMessage}
                                </div>
                            }

                            <div className="flex justify-center">
                                <button type="submit" onClick={handleSubmission} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPopup;