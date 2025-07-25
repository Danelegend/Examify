import React, { useContext } from "react";
import SocialLogin from "react-social-login";
import { UserContext } from "../../../context/user-context";
import { useMutation } from "@tanstack/react-query";
import { storeAccessToken, storeExpiration } from "../../../util/utility";
import { SignInResponse } from "../../../api/types";
import { PostFacebookSignIn } from "../../../api/api";

class SignInWithFacebookButton extends React.Component {
    render() {
        const { triggerLogin, title } = this.props;

        return (
            <button onClick={triggerLogin} className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 48 48" version="1.1">
                <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
                        <path
                            d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                            id="Facebook">
                            
                        </path>
                    </g>
                </g>
            </svg>

            <span>{title}</span>
        </button>
        )
    }
}

const SignInWithFacebookWrapper = SocialLogin(SignInWithFacebookButton);

const SignInWithFacebook = ({ title, SetResponseMessage, onSuccess }: { title: string, SetResponseMessage: (msg: string) => void, onSuccess: () => void }) => {
    let facebook_token: null | string = null;

    const { setAccessToken } = useContext(UserContext);

    const { mutateAsync: FacebookSignInMutation } = useMutation({
        mutationFn: PostFacebookSignIn,
        onSuccess: (res) => {
            res.json().then((data: SignInResponse) => {
                switch (res.status) {
                    case 500:
                        SetResponseMessage(data.message)
                        break
                    case 403:
                        SetResponseMessage(data.message)
                        break
                    case 400:
                        SetResponseMessage("Problem with Facebook Login")
                        break
                    case 200:
                        storeAccessToken(data.access_token)
                        storeExpiration(data.expiration)
                        setAccessToken(data.access_token)
                        onSuccess()
                        break
                    default:
                        break
                }
            })
        },
        onError: (e) => {
            console.log(e);
        }
    })

    const onFacebookSuccess = (res) => {
        facebook_token = res._token.accessToken

        if (facebook_token === null) {
            SetResponseMessage("Problem with Facebook Login")
            return
        }

        FacebookSignInMutation({
            facebook_token: facebook_token
        })
    }

    const onFacebookFailure = (e) => {
        console.log(e);
    }

    return (
        <SignInWithFacebookWrapper  title={title} 
                                    appId={"655582286693435"} 
                                    provider={"facebook"}
                                    onLoginSuccess={onFacebookSuccess}
                                    onLogoutFailure={onFacebookFailure} />
    )
}

export default SignInWithFacebook;