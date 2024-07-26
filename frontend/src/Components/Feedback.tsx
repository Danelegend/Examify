import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { readAccessToken } from "../util/utility";
import { PostFeedback } from "../api/api";

type FeedbackPopupProps = {
    onExit: () => void,
}

type Feedback = {
    name?: string,
    email?: string,
    feedback: string,
}

const FeedbackPopup = ({ onExit }: FeedbackPopupProps) => {
    const [DisplayForm, SetDisplayForm] = useState<boolean>(false);

    return (
        DisplayForm ? 
        <FeedbackForm onExit={() => SetDisplayForm(false)}/> :
        <FeedbackBubble onExit={onExit} onClick={() => SetDisplayForm(true)}/>
    )
}

const FeedbackBubble = ({ onExit, onClick }: { onExit: () => void, onClick: () => void }) => {
    return (
        <div className="fixed z-50 flex bottom-5 right-5 bg-blue-700 rounded-2xl rounded-br-none cursor-pointer" onClick={onClick}>
            <div className="relative">
                <div className="absolute rounded-full w-4 h-4 bg-white text-black -top-1 -left-1 flex justify-center cursor-pointer" onClick={onExit}>
                    <div className="m-auto">
                        <RxCross1 size={10}/>
                    </div>
                </div>
                <div className="px-4 py-4 font-display text-white">
                    Provide Feedback
                </div>
            </div>
        </div>
    )
}

const FeedbackForm = ({ onExit }: { onExit: () => void }) => {
    const [Feedback, SetFeedback] = useState<Feedback>({
        feedback: ""
    })

    const submit = () => {
        PostFeedback({
            request: {
                name: Feedback.name,
                email: Feedback.email,
                feedback: Feedback.feedback
            }
        })
    }

    return (
        <div className="fixed flex z-50 justify-end items-end w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow pb-4">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Feedback
                        </h3>
                        <button type="button" onClick={onExit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <div className="text-xl">
                                x
                            </div>
                        </button>
                    </div>
                    <form className="px-4 pt-2  md:px-5">
                        <div className="grid gap-4 mb-4 grid-cols-2 sm:grid-cols-1">
                            {
                                readAccessToken() === null ?
                                <>
                                    <div className="col-span-1">
                                        <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Name" onChange={(e) => SetFeedback({...Feedback, name: e.target.value})}/>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Email" onChange={(e) => SetFeedback({...Feedback, email: e.target.value})}/>
                                    </div>
                                </> :
                                null
                            }
                            <div className="col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 text-center">Share your Thoughts</label>
                                <textarea rows={3} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Feedback" onChange={(e) => SetFeedback({...Feedback, feedback: e.target.value})}/>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer" onClick={submit}>
                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                Submit
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div> 
    )
}

export default FeedbackPopup;