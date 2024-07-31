import { useContext, useEffect, useRef, useState } from "react"
import { TiTick } from "react-icons/ti"
import { ImCross } from "react-icons/im";
import { useScreen } from "usehooks-ts"
import Latex from "react-latex-next";
import { FetchQuestion, PostUserQuestionAnswer } from "../../../api/api";
import { readAccessToken } from "../../../util/utility";
import { useQuery } from "@tanstack/react-query";
import { dotSpinner } from "ldrs"
import { ModalContext } from "../../../context/modal-context";

type QuestionDisplayProps = {
    id: number
}

type QuestionProps = {
    question: string
}

type SolutionInputProps = {
    solution: string[]
    question_id: number
}

type Question = {
    subject: string
    topic: string
    title: string
    grade: number
    difficulty: number
    question: QuestionDataType
    solutions: SolutionDataType
}

type QuestionDataType = {
    question: string
    diagram?: any // TODO: Image
}

type SolutionDataType = {
    solutions: string[]
}

type ViewSolutionProps = {
    solution: string[]
}

const QuestionDisplay = ({ id }: QuestionDisplayProps) => {
    const [QuestionData, SetQuestionData] = useState<Question | null>(null)

    const { data, isPending } = useQuery({
        queryKey: ["Question", id],
        queryFn: () => FetchQuestion({ question_id: id })
    })

    useEffect(() => {
        if (isPending) return
    
        SetQuestionData({
            subject: data!.subject,
            topic: data!.topic,
            title: data!.title,
            grade: data!.grade,
            difficulty: data!.difficulty,
            question: {
                question: data!.question
            },
            solutions: {
                solutions: data!.answers
            }
        })
    }, [data, isPending])

    dotSpinner.register()

    return (
        <div className="flex flex-col space-y-24">
            {
                QuestionData === null
                ?
                <l-dot-spinner
                    size="35"
                    speed="1"
                    color="black"
                /> :
                <>
                    <Question question={QuestionData!.question.question}/>
                    <div className="flex justify-center">
                        {
                            QuestionData!.solutions.solutions.length >= 1 ? 
                            <ViewSolution solution={QuestionData!.solutions.solutions}/>
                            : null
                        }
                    </div>
                </>
            }
        </div>
    )
}

const Question = ({ question }: QuestionProps) => {
    const size = useScreen()

    return (
        <div className={(size.width > 760) ? "" : ""}>
            <div className={((size.width > 760) ? "py-24 px-10" : "py-10 px-5") + " flex justify-center bg-white"}>
                <div className="text-2xl font-medium text-center text-black">
                    <Latex>{question}</Latex>
                </div>
            </div>
        </div>
    )
}

const SolutionInput = ({ solution, question_id }: SolutionInputProps) => {
    const [Answer, SetAnswer] = useState<string>("")
    const [isCorrect, SetIsCorrect] = useState<boolean | null>(null)

    const SolutionInput = useRef(null)

    const CompareSolutionAndAnswer = (solutions: string[], answer: string) => {
        return solutions.includes(answer)
    }

    const onSubmit = () => {
        if (CompareSolutionAndAnswer(solution, Answer)) {
            SetIsCorrect(true)
        } else {
            SetIsCorrect(false)
        }

        const token = readAccessToken()

        if (token !== null) {
            PostUserQuestionAnswer({ 
                request: { question_id: question_id, answer: [Answer] } 
            })
        }
    }

    const onClear = () => {
        SetAnswer("")
        SolutionInput.current!.value = ""
        SetIsCorrect(null)
    }

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex space-x-4">
                <label className="font-base text-2xl my-auto">
                    Solution: 
                </label>
                <input className="block w-full p-2.5" onChange={(e) => SetAnswer(e.target.value)} ref={SolutionInput}/>
                {
                    (isCorrect !== null) ?
                    <div className="m-auto">
                        {
                            isCorrect 
                            ? 
                            <TiTick size={32} color={"green"}/>
                            : 
                            <ImCross size={18} color={"red"}/>
                        }
                    </div>
                    : null
                }
            </div>
            {
                (Answer !== "") ?
                <div>
                    Your solution: {Answer}
                </div>
                : null
            }
            <div className="flex justify-evenly">
                <button className="bg-green-300 hover:border-black hover:border-2"
                    onClick={onSubmit}>
                    <div>
                        Submit
                    </div>
                </button>
                <button className="bg-red-300 hover:border-black hover:border-2"
                    onClick={onClear}>
                    <div>
                        Clear
                    </div>
                </button>
            </div>
        </div>
    )
}

const ViewSolution = ({ solution }: ViewSolutionProps) => {
    const [DisplaySolution, SetDisplaySolution] = useState<boolean>(false)
    
    const { SetDisplayLogin } = useContext(ModalContext)

    const size = useScreen();

    const onSolutionShownButtonClick = () => {
        if (DisplaySolution === false) {
            // Only display solution if the user is logged in
            if (readAccessToken() === null) {
                SetDisplayLogin(true)
                return
            }
        }

        SetDisplaySolution(!DisplaySolution)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <button onClick={onSolutionShownButtonClick} className={(DisplaySolution ? "bg-red-300" : "bg-green-300") + " text-black"}>
                    {
                        DisplaySolution ? "Hide Solution" : "View Solution"
                    }
                </button>
            </div>
            {
                DisplaySolution ?
                <div className={(size.width > 760) ? "" : ""}>
                    <div className="flex flex-col space-y-4">
                        {
                            solution.map((sol, index) => {
                                return (
                                    <div key={index} className={((size.width > 760 && solution.length <= 1) ? "py-10" : "py-6") + " flex flex-col justify-center bg-white"}>
                                        <div className="text-2xl text-center font-medium text-black">
                                            <Latex>{sol}</Latex>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default QuestionDisplay