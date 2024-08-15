import { useContext, useState } from "react"
import { validateEmail, validatePasswordLength, validatePasswordLowerCaseLetter, validatePasswordNumber } from "../../AuthUtil"
import SignInWithGoogle from "../../Components/GoogleButton"
import SignInWithFacebook from "../../Components/FacebookButton"
import { useMutation } from "@tanstack/react-query"
import { ring } from "ldrs";
import { SignUpResponse } from "../../../../api/types"
import { storeAccessToken, storeExpiration } from "../../../../util/utility"
import { UserContext } from "../../../../context/user-context"
import { ModalContext } from "../../../../context/modal-context"
import { PostUserRegistration } from "../../../../api/api"

const RegistrationScreen1 = ({ changeScreen } : 
    { 
        changeScreen: () => void
    }) => 
    {
    const [FirstName, SetFirstName] = useState<string>("")
    const [LastName, SetLastName] = useState<string>("")
    const [Email, SetEmail] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")
    const [ConfirmPassword, SetConfirmPassword] = useState<string>("")

    const [ResponseMessage, SetResponseMessage] = useState<string | null>(null)

    const { setAccessToken } = useContext(UserContext)
    const { SetDisplayRegister } = useContext(ModalContext)

    const handleFirstNameChange = (e) => {
        SetFirstName(e.target.value)
    }

    const handleLastNameChange = (e) => {
        SetLastName(e.target.value)
    }
    
    const handleEmailChange = (e) => {
        SetEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        SetPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        SetConfirmPassword(e.target.value)
    }

    const handleGoogleRegistrationSuccess = () => {
        SetDisplayRegister(false)
        changeScreen()
    }

    const handleFacebookRegistrationSuccess = () => {
        SetDisplayRegister(false)
    }

    const handleSubmission = async () => {
        if (FirstName === "") {
            SetResponseMessage("Provide a first name")
        } else if (LastName === "") {
            SetResponseMessage("Provide a last name")
        } else if (!validateEmail(Email)) {
            SetResponseMessage("Invalid Email")
        } else if (!validatePasswordLength(Password)) {
            SetResponseMessage("Password must be at least 8 characters long")
        } else if (!validatePasswordLowerCaseLetter(Password)) {
            SetResponseMessage("Password must contain at least one lowercase letter")
        } else if (!validatePasswordNumber(Password)) {
            SetResponseMessage("Password must contain at least one number")
        } else if (Password !== ConfirmPassword) {
            SetResponseMessage("Passwords do not match")
        } else {
            SetResponseMessage(null)

            // Register User
            SignUpMutation({
                request: {
                    first_name: FirstName,
                    last_name: LastName,
                    email: Email,
                    password: Password
                }
            })
        }
    }

    const { mutateAsync: SignUpMutation, isPending } = useMutation({
        mutationFn: PostUserRegistration,
        onSuccess: (res) => {
            res.json().then((data: SignUpResponse) => {
                switch (res.status)  {
                    case 500:
                        SetResponseMessage("Internal Error")
                        break
                    case 400:
                        if (data.detail === undefined) {
                            SetResponseMessage("Unknown Error")
                        } else {
                            SetResponseMessage(data.detail)
                        }

                        break
                    case 200:
                        storeAccessToken(data.access_token)
                        storeExpiration(data.expiration)
                        setAccessToken(data.access_token)
                        changeScreen()
                        break
                    default:
                        SetResponseMessage("Unknown Error")
                        break
                }
            })
        },
        onError: (e) => {
            SetResponseMessage("Internal Error")
        }
    })

    ring.register()
    return (
        <div>
            <form className="px-4 pt-4 pb-0.5 md:px-5 md:pt-5 md:pb-1">
                <div className="grid gap-4 mb-4 grid-cols-2 sm:grid-cols-1">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                        <input type="text" onChange={handleFirstNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="First Name" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                        <input type="text" onChange={handleLastNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Last Name" />
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input type="text" onChange={handleEmailChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Email" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input type="password" onChange={handlePasswordChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Password" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                        <input type="password" onChange={handleConfirmPasswordChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Confirm Password" />
                    </div>
                </div>
                <div className="flex justify-center">
                    {
                        (isPending) ? 
                        <l-ring
                              size="40"
                              stroke="5"
                              bg-opacity="0"
                              speed="2" 
                              color="black" 
                            /> : 
                        <div onClick={handleSubmission} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer">
                           <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                            Register
                        </div>

                    }
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
            <div className="flex flex-col justify-center items-center pt-1 pb-5">
                <div className="flex flex-col gap-3">
                    <SignInWithGoogle title={"Sign Up With Google"} SetResponseMessage={SetResponseMessage} onSuccess={handleGoogleRegistrationSuccess}/>
                    {/*<SignInWithFacebook title={"Sign Up With Facebook"} SetResponseMessage={SetResponseMessage} onSuccess={handleFacebookRegistrationSuccess}/>*/}
                </div>
            </div>
        </div>
    )
}

export default RegistrationScreen1