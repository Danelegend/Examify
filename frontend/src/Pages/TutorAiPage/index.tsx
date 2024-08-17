import { useContext, useEffect, useRef, useState } from "react"
import { MdFileUpload, MdCancel } from "react-icons/md";
import { BsTriangleFill } from "react-icons/bs";
import { GetConversationMessageImage, PostConversationMessage, PostNewConversation } from "../../api/api";
import Latex from "react-latex-next";
import { readAccessToken } from "../../util/utility";
import { ModalContext } from "../../context/modal-context";
import { useMutation } from "@tanstack/react-query";
import { ring } from "ldrs";


const SUBJECTS_LIST = [
                    "Maths Extension 2", 
                    "Maths Extension 1", 
                    "Maths Advanced",
                    "Maths Standard 2"
                ]

const SUBJECT_TOPIC_MAP = {
    "Maths Extension 2": [
        "Integration",
        "Mechanics",
        "Complex Numbers",
        "Vectors",
        "Proofs"
    ],
    "Maths Extension 1": [
        "Further work with functions",
        "Polynomials",
        "Graphing functions",
        "Further trigonometric identities",
        "Inverse functions",
        "Permutations and combinations",
        "Rates of change and their application",
        "Trigonometric equations",
        "Proof by mathematical induction",
        "Vectors in two dimensions",
        "Applications of calculus",
        "Differential equations",
        "Motion, forces and projectiles",
        "The binomial distribution"
    ],
    "Maths Advanced": [
        "Algebraic techniques",
        "Trigonometry",
        "Further Algebraic techniques",
        "Functions",
        "Equations and functions",
        "Further trigonometry",
        "Introduction to differentiation",
        "Exponential and logarithmic functions",
        "Probability",
        "Discrete probability distributions",
        "Descriptive statistics",
        "Trigonometric functions and graphs",
        "Differential calculus",
        "The first and second derivative",
        "Graphing techniques",
        "The anti-derivative",
        "Integral calculus",
        "Financial mathematics",
        "Bivariate data analysis",
        "Random variables"
    ],
    "Maths Standard 2": [
        "Annuities",
        "Bivariate Data Analysis",
        "Critical Path Analysis",
        "Investments and Loans",
        "Network Concepts",
        "Non-Linear Relationships",
        "Non-Right-Angled Trigonometry",
        "Normal Distribution",
        "Rates and Ratios",
        "Simulataneous Linear Equations"
    ]
}

type Submission = {
    subject: typeof SUBJECTS_LIST[number],
    topic: string,
    ask: string,
    supporting_image: File | null
}

type Message = {
    message?: string,
    id?: number,
    image?: string,
    sender: "user" | "tutor"
}

type ConversationData = {
    conversation_id: number | null,
    messages: Message[]
}

const TutorAiPage = () => {
    const [ConversationData, SetConversationData] = useState<ConversationData>(DEFAULT_CONVERSATION_DATA)

    const { SetDisplayRegister } = useContext(ModalContext)

    const { mutateAsync: PostNewConversationRequest, isPending: isPostNewConversationPending } = useMutation({
        mutationFn: PostNewConversation,
        onSuccess: (resp) => {
            SetConversationData({
                conversation_id: resp.conversation_id,
                messages: [
                        {
                            message: "Hello. What can I help you with today?",
                            sender: "tutor"
                        },
                        {
                            message: resp.student_message.contents[0],
                            sender: "user",
                            image: resp.student_message.has_image ? GetConversationMessageImage({
                                request: {
                                    message_id: resp.student_message.id,
                                    conversation_id: resp.conversation_id
                                }
                            }) : undefined,
                            id: resp.student_message.id
                        },
                        {
                            message: resp.tutor_message.contents[0],
                            sender: "tutor",
                            image: resp.tutor_message.has_image ? GetConversationMessageImage({
                                request: {
                                    message_id: resp.tutor_message.id,
                                    conversation_id: resp.conversation_id
                                }
                            }) : undefined,
                            id: resp.tutor_message.id
                        }
                    ]
                }
            )
        }
    })

    const { mutateAsync: PostConversationMessageRequest, isPending: isPostConversationMessagePending } = useMutation({
        mutationFn: PostConversationMessage,
        onSuccess: (resp) => {
            SetConversationData({
                conversation_id: ConversationData.conversation_id,
                messages: [...ConversationData.messages.slice(0, -1),
                    {
                        message: resp.student_message.contents[0],
                        sender: "user",
                        image: resp.student_message.has_image && ConversationData.conversation_id !== null ? GetConversationMessageImage({
                            request: {
                                message_id: resp.student_message.id,
                                conversation_id: ConversationData.conversation_id
                            }
                        }) : undefined,
                        id: resp.student_message.id
                    },
                    {
                        message: resp.tutor_message.contents[0],
                        sender: "tutor",
                        image: resp.tutor_message.has_image && ConversationData.conversation_id !== null ? GetConversationMessageImage({
                            request: {
                                message_id: resp.student_message.id,
                                conversation_id: ConversationData.conversation_id
                            }
                        }) : undefined,
                        id: resp.tutor_message.id
                    }
                ]
            })
        }
    })

    const CreateNewConversation = (submission: Submission) => {
        if (readAccessToken() === null) {
            SetDisplayRegister(true)
            return
        }

        SetConversationData({...ConversationData, messages: [
            {
                message: "Hello. What can I help you with today?",
                sender: "tutor"
            },
            {
                message: submission.ask,
                sender: "user",
                image: submission.supporting_image ? URL.createObjectURL(submission.supporting_image) : undefined
            }
        ]})

        PostNewConversationRequest({
            request: {
                subject: submission.subject,
                topic: submission.topic,
                question: submission.ask,
                supporting_image: submission.supporting_image
            }})
    }

    const CreateNewConversationMessage = (chat: string) => {
        if (readAccessToken() === null) {
            SetDisplayRegister(true)
            return
        }

        if (ConversationData.conversation_id === null) {
            return
        }

        SetConversationData({...ConversationData, messages: [...ConversationData.messages, {message: chat, sender: "user"}]})

        PostConversationMessageRequest({
            request: {
                conversation_id: ConversationData.conversation_id,
                message: chat
            }
        })
    }

    return (    
        <div className="mx-auto mb-12 mt-4 flex flex-col items-center gap-8 px-4 sm:gap-10 sm:px-6 max-w-7xl">
            <div className="flex justify-center">
                <h1>
                    Welcome to Tutor AI
                </h1>
            </div>
            <div className="grid grid-cols-3 gap-14">
                <SubmissionPanel className="col-span-1 min-w-40 bg-white border rounded-lg shadow p-8 lg:p-16 border-slate-300" SubmitConversation={CreateNewConversation}/>
                <DisplayPanel className="col-span-2 bg-white border rounded-lg shadow border-slate-300 max-h-screen" conversationData={{
                    conversation_id: ConversationData.conversation_id,
                    messages: ConversationData.messages
                }} onChatSubmit={CreateNewConversationMessage}
                awaitingMessage={isPostNewConversationPending || isPostConversationMessagePending}/>
            </div>
        </div>
    )
}

type SubmissionPanelProps = {
    SubmitConversation: (submission: Submission) => void,
    className?: string
}

const createFileDataUrl = (file: File): string => {
    return URL.createObjectURL(file)
}

const SubmissionPanel = ({ SubmitConversation, className }: SubmissionPanelProps) => {
    const [SubmissionRequest, SetSubmissionRequest] = useState<Submission>({
        subject: "Maths Extension 2",
        topic: SUBJECT_TOPIC_MAP["Maths Extension 2"][0],
        ask: "",
        supporting_image: null
    })
    
    const hiddenFileInput = useRef(null)

    const handleFileChange = (e) => {
        if (e.target.files.length === 0) { 
            SetSubmissionRequest({...SubmissionRequest, supporting_image: null})
        } else {
            const fileUploaded = e.target.files[0]
            SetSubmissionRequest({...SubmissionRequest, supporting_image: fileUploaded})
        }
    }

    const onConversationSubmitClick = () => {
        SubmitConversation(SubmissionRequest)
    }

    return (
        <div className={className}>
            <div className="flex flex-col space-y-12 mx-auto">
                <div className="flex flex-col space-y-4">
                    <h2 className="text-cyan-700 font-bold">
                        1. Select a Subject
                    </h2>
                    <select className="w-full border-2 border-cyan-700/60 text-cyan-700 selection:border-cyan-700/60 font-semibold px-2 py-1 rounded-md shadow" onChange={e => SetSubmissionRequest({...SubmissionRequest, subject: e.target.value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())})}>
                        {
                            SUBJECTS_LIST.map((subject: string) => {
                                return (
                                    <option value={subject.toLowerCase()} key={subject}>{subject}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="text-cyan-700 font-bold">
                        2. Select a Topic
                    </h2>
                    <select className="w-full border-2 border-cyan-700/60 text-cyan-700 selection:border-cyan-700/60 font-semibold px-2 py-1 rounded-md shadow" onChange={(e) => SetSubmissionRequest({...SubmissionRequest, topic: e.target.value})}>
                        {
                            SUBJECT_TOPIC_MAP[SubmissionRequest.subject].map((topic: string) => {
                                return (
                                    <option value={topic.toLowerCase()} key={topic}>{topic}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="text-cyan-700 font-bold">
                        3. Upload Photo of your Problem <span className="text-gray-400 font-semibold">(Optional)</span>
                    </h2>
                    <>
                        <div className="relative w-full border-2 border-cyan-700/60 selection:border-cyan-700/60 rounded-md shadow aspect-video flex justify-center items-center cursor-pointer" onClick={() => hiddenFileInput.current.click()}>
                            {
                                SubmissionRequest.supporting_image === null ?
                                <MdFileUpload className="" size={32} color={"gray"}/> :
                                <>
                                    <img src={createFileDataUrl(SubmissionRequest.supporting_image)} alt="Supporting Image" className="w-full h-full object-cover" />
                                    <MdCancel className="absolute top-0 right-0" size={32} color={"red"} onClick={() => SetSubmissionRequest({...SubmissionRequest, supporting_image: null})}/>
                                </>
                            }
                        </div>
                        <input type="file" ref={hiddenFileInput} style={{display: 'none'}} onChange={handleFileChange}/>
                    </>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="text-cyan-700 font-bold">
                        4. Ask your Question
                    </h2>
                    <textarea rows={4} className="w-full border-2 border-cyan-700/60 text-cyan-700 selection:border-cyan-700/60 font-semibold px-2 py-1 rounded-md shadow placeholder:font-normal" placeholder="How do we solve this?" onChange={(e) => SetSubmissionRequest({...SubmissionRequest, ask: e.target.value})}/>
                </div>
                <div className="flex justify-center">
                    <button className="border-cyan-700/60 border-2 bg-cyan-700/10" onClick={onConversationSubmitClick}>
                        Create Conversation
                    </button>
                </div>
            </div>
        </div>
    )
}

type DisplayPanelProps = {
    onChatSubmit: (chat: string) => void,
    conversationData: ConversationData,
    className?: string,
    awaitingMessage: boolean
}

const DEFAULT_CONVERSATION_DATA: ConversationData = {
    conversation_id: null,
    messages: [
        {
            message: "Hello. What can I help you with today?",
            sender: "tutor"
        }
    ]
}

const DisplayPanel = ({ onChatSubmit, conversationData, className, awaitingMessage }: DisplayPanelProps) => { 
    const [ChatInput, SetChatInput] = useState<string>("")

    const ref = useRef(null)

    const submit = () => {
        onChatSubmit(ChatInput)
        ref.current.value = ""
    }

    const onKeyDownHandler = (e) => {
        if (e.key === 'Enter' && e.shiftKey) 
            return;
        
        if (e.key === 'Enter') {
            submit()
        }
    }

    ring.register()

    return (
        <div className={className}>
            <div className="h-full flex flex-col justify-between">
                <div className="overflow-y-auto">
                    {
                        conversationData.messages.map((message: Message, index: number) => {
                            return (
                                <article className={(message.sender === "tutor" ? "bg-slate-200" : "bg-white") + (index > 0 ? " border-t border-slate-300" : "") + " grid grid-cols-5 px-20 py-10 flex-col"} key={index}>
                                    <div className="font-semibold">
                                        {
                                            message.sender === "tutor" ? ("Tutor " + String.fromCodePoint(0x1F913)) : ("You " + String.fromCodePoint(0x1F60E))
                                        }
                                    </div>
                                    <div className="flex flex-col col-span-4 relative">
                                        {
                                            message.image && <img src={message.image} alt="" className="mb-4"/>
                                        }
                                        {
                                            message.message && <Latex>{message.message}</Latex>
                                        }
                                    </div>
                                </article>
                            )
                        })
                    }
                    {
                        awaitingMessage && <div className="flex justify-center my-8">
                            <l-ring
                                size="40"
                                stroke="5"
                                bg-opacity="0"
                                speed="2" 
                                color="black" 
                            />
                        </div>
                    }
                </div>
                <div className="relative">
                    <textarea rows={2} ref={ref} className="w-full h-full text-gray-900 py-2 pl-4 pr-24 bg-slate-400 placeholder:text-gray-600" placeholder="Chat with Solution" onChange={e => SetChatInput(e.target.value)} onKeyDown={onKeyDownHandler}/>
                    <BsTriangleFill className="absolute right-2 top-5 cursor-pointer" size={32} color={"#718096"} style={{rotate: '90deg'}} onClick={submit}/>
                </div>
            </div>
        </div>
    )
}

export default TutorAiPage;