import { useContext, useRef, useState } from "react";
import SignInWithGoogle from "../Components/GoogleButton";
import SignInWithFacebook from "../Components/FacebookButton";
import { useMutation } from "@tanstack/react-query";
import { validateEmail } from "../AuthUtil";
import { SignInResponse } from "../../../api/types";
import { storeAccessToken, storeExpiration } from "../../../util/utility";
import { UserContext } from "../../../context/user-context";
import { ModalContext } from "../../../context/modal-context";
import { useOnClickOutside } from "usehooks-ts";
import { PostUserSignIn } from "../../../api/api";

type LoginPopupProps = {
    onExit: () => void,
}

const LoginPopup = ({ onExit }: LoginPopupProps) => {
    const [Email, SetEmail] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    
    const [ResponseMessage, SetResponseMessage] = useState<string | null>(null)

    const { setAccessToken } = useContext(UserContext)
    const { SetDisplayLogin } = useContext(ModalContext)

    const loginRef = useRef(null)

    useOnClickOutside(loginRef, () => onExit())

    const handleEmailChange = (e) => {
        SetEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        SetPassword(e.target.value);
    }

    const { mutateAsync: SignInMutation } = useMutation({
        mutationFn: PostUserSignIn,
        onSuccess: (res) => {
            res.json().then((data: SignInResponse) => {
                switch (res.status) {
                    case 500:
                        SetResponseMessage("Internal Error")
                        break
                    case 403:
                        SetResponseMessage("Invalid Email or Password")
                        break
                    case 200:
                        storeAccessToken(data.access_token)
                        storeExpiration(data.expiration)
                        setAccessToken(data.access_token)
                        break
                    default:
                        SetResponseMessage(data.message)
                        break
                }
            })
            
        },
        onError: (e) => {
            console.log(e)
            SetResponseMessage("Unknown Error")
        }
    })

    const handleLogin = async () => {
        if (Email === "") {
            SetResponseMessage("Provide an email")
        } else if (Password === "") {
            SetResponseMessage("Provide a password")
        } else if (!validateEmail(Email)) {
            SetResponseMessage("Invalid Email")
        } else {
            SetResponseMessage(null)

            try {
                await SignInMutation({
                    request: {
                        email: Email,
                        password: Password
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const handleGoogleLoginSuccess = () => {
        SetDisplayLogin(false)
    }

    const handleFacebookLoginSuccess = () => {
        SetDisplayLogin(false)
    }

    return (
        <div className="fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div ref={loginRef} className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900 ">
                            Login
                        </h3>
                        <button type="button" onClick={onExit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <div className="text-xl">
                                x
                            </div>
                        </button>
                    </div>

                    <form className="px-4 pt-2  md:px-5">
                        <div className="grid gap-4 mb-4 grid-cols-1">
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="text" onChange={handleEmailChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Email" />
                            </div>
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input type="password" onChange={handlePasswordChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Password" />
                            </div>
                            
                            <div className="flex justify-center">
                                <div onClick={handleLogin} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                    Sign In
                                </div>
                            </div>
                        </div>

                            {
                                (ResponseMessage === null) ? null : 
                                <div className="text-red-600 text-center">
                                    {ResponseMessage}
                                </div>
                            }
                    </form>



                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-2 text-gray-400 font-medium">or</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>

                    <div className="flex flex-col justify-center items-center pt-1 pb-4">
                        <div className="flex flex-col gap-3">
                            <SignInWithGoogle title={"Sign In With Google"} SetResponseMessage={SetResponseMessage} onSuccess={handleGoogleLoginSuccess}/>
                            {/*<SignInWithFacebook title={"Sign In With Facebook"} SetResponseMessage={SetResponseMessage} onSuccess={handleFacebookLoginSuccess}/>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPopup;