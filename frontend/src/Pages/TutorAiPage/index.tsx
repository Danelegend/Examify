import { useRef, useState } from "react"
import { MdFileUpload, MdCancel } from "react-icons/md";
import { BsTriangleFill } from "react-icons/bs";


const SUBJECTS_LIST = [
                    "Maths Extension 2", 
                    "Maths Extension 1", 
                    "Maths Advanced"
                ]

const SUBJECT_TOPIC_MAP = {
    "Maths Extension 2": [
        "Integration",
        "Differentiation",
        "Complex Numbers",
        "Vectors",
        "Polynomials"
    ],
    "Maths Extension 1": [
        "Integration",
        "Differentiation",
        "Complex Numbers",
        "Vectors",
        "Polynomials"
    ],
    "Maths Advanced": [
        "Integration",
        "Differentiation",
        "Complex Numbers",
        "Vectors",
        "Polynomials"
    ]
}

type Submission = {
    subject: typeof SUBJECTS_LIST[number],
    topic: string,
    ask: string,
    supporting_image: string | null
}

const TutorAiPage = () => {
    return (
        <div className="mx-auto mb-12 mt-4 flex flex-col items-center gap-8 px-4 sm:gap-10 sm:px-6 max-w-7xl">
            <div className="flex justify-center">
                <h1>
                    Welcome to Tutor AI
                </h1>
            </div>
            <div className="grid grid-cols-3 gap-14">
                <SubmissionPanel className="col-span-1 min-w-40 bg-white border rounded-lg shadow p-8 lg:p-16 border-slate-300"/>
                <DisplayPanel className="col-span-2 bg-white border rounded-lg shadow border-slate-300 max-h-7xl"/>
            </div>
        </div>
    )
}

type SubmissionPanelProps = {
    className?: string
}

const SubmissionPanel = ({ className }: SubmissionPanelProps) => {
    const [SubmissionRequest, SetSubmissionRequest] = useState<Submission>({
        subject: "Maths Extension 2",
        topic: "",
        ask: "",
        supporting_image: null
    })
    
    const hiddenFileInput = useRef(null)

    const handleFileChange = (e) => {
        const fileUploaded = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            SetSubmissionRequest({...SubmissionRequest, supporting_image: reader.result as string})
        }
        reader.readAsDataURL(fileUploaded)
    }

    console.log(SubmissionRequest)

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
                    <select className="w-full border-2 border-cyan-700/60 text-cyan-700 selection:border-cyan-700/60 font-semibold px-2 py-1 rounded-md shadow">
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
                                    <img src={SubmissionRequest.supporting_image} alt="Supporting Image" className="w-full h-full object-cover" />
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
                    <textarea rows={4} className="w-full border-2 border-cyan-700/60 text-cyan-700 selection:border-cyan-700/60 font-semibold px-2 py-1 rounded-md shadow placeholder:font-normal" placeholder="How do we solve this?"/>
                </div>
            </div>
        </div>
    )
}

type DisplayPanelProps = {
    className?: string
}

type Message = {
    message?: string,
    image?: string,
    sender: "user" | "tutor"
}

const DisplayPanel = ({ className }: DisplayPanelProps) => {
    const [Messages, SetMessages] = useState<Message[]>([
        {
            message: "Hello. What can I help you with today?",
            sender: "tutor"
        }
    ])

    return (
        <div className={className}>
            <div className="h-full flex flex-col justify-between">
                <ul className="flex flex-col">
                    {
                        Messages.map((message: Message, index: number) => {
                            return (
                                <li className={(message.sender === "tutor" ? "bg-slate-200" : "bg-white") + (index > 0 ? " border-t border-slate-300" : "") + " grid grid-cols-5 px-20 py-10 flex-col flex-grow"} key={index}>
                                    <div className="font-semibold">
                                        {
                                            message.sender === "tutor" ? ("Tutor " + String.fromCodePoint('0x1F913')) : ("You " + String.fromCodePoint('0x1F60E'))
                                        }
                                    </div>
                                    <div className="flex flex-col col-span-4">
                                        {
                                            message.image && <img src={message.image} alt=""/>
                                        }
                                        {
                                            message.message && <p>{message.message}</p>
                                        }
                                    </div>
                                </li>
                            )
                        })
                    }

                </ul>
                <div className="relative">
                    <textarea rows={2} className="w-full h-full text-gray-900 py-2 pl-4 pr-24 bg-slate-400 placeholder:text-gray-600" placeholder="Chat with Solution" />
                    <BsTriangleFill className="absolute right-2 top-5 cursor-pointer" size={32} color={"#718096"} style={{rotate: '90deg'}}/>
                </div>
            </div>
        </div>
    )
}

export default TutorAiPage;