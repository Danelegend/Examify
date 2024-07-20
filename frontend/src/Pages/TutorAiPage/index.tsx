import { useState } from "react"

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
        <div className="flex flex-col">
            <div className="flex justify-center">
                <h1>
                    Welcome to Tutor AI
                </h1>
            </div>
            <div>
            <SubmissionPanel />
                <DisplayPanel />
            </div>
        </div>
    )
}

const SubmissionPanel = () => {
    const [SubmissionRequest, SetSubmissionRequest] = useState<Submission>({
        subject: "Maths Extension 2",
        topic: "",
        ask: "",
        supporting_image: null
    })
    
    console.log(SubmissionRequest)

    return (
        <div>
            <div className="flex flex-col space-y-4 mx-auto">
                <div>
                    <h2>
                        1. Select a Subject
                    </h2>
                    <select className="w-full" onChange={e => SetSubmissionRequest({...SubmissionRequest, subject: e.target.value})}>
                        {
                            SUBJECTS_LIST.map((subject: string) => {
                                return (
                                    <option value={subject.toLowerCase()}>{subject}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div>
                    <h2>
                        2. Select a Topic
                    </h2>
                    <select className="w-full">
                        {
                            SUBJECT_TOPIC_MAP[SubmissionRequest.subject].map((topic: string) => {
                                return (
                                    <option value={topic.toLowerCase()}>{topic}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div>
                    <h2>
                        3. Upload Image
                    </h2>
                    <input />
                </div>
                <div>
                    <h2>
                        4. Ask your Question
                    </h2>
                    <input />
                </div>
            </div>
        </div>
    )
}

const DisplayPanel = () => {
    return (
        <div>

        </div>
    )
}

export default TutorAiPage;