import { useRef, useState } from "react"
import { TiTick } from "react-icons/ti"
import { ImCross } from "react-icons/im";
import { useScreen } from "usehooks-ts"
import Latex from "react-latex-next";

type QuestionDisplayProps = {
    id: number
}

type QuestionProps = {
    question: string
}

type SolutionInputProps = {
    solution: string[]
}

type Question = {
    subject: string
    topic: string
    title: string
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

const QUESTION: Question = {
    subject: "Maths Extension 2",
    topic: "Complex Numbers",
    title: "Solve for x in 1x + 2 = 3",
    difficulty: 2,
    question: {
        question: "Solve for $x$ in $1x + 2 = 3$"
    },
    solutions: {
        solutions: ["x = 1", "1"]
    }
}

const QuestionDisplay = ({ id }: QuestionDisplayProps) => {
    const [QuestionData, SetQuestionData] = useState<Question | null>(QUESTION)

    return (
        <div className="flex flex-col space-y-24">
            <Question question={QuestionData!.question.question}/>
            <div className="flex justify-center">
                <SolutionInput solution={QuestionData!.solutions.solutions}/>
            </div>
        </div>
    )
}

const Question = ({ question }: QuestionProps) => {
    const size = useScreen()

    return (
        <div className={(size.width > 760) ? "" : ""}>
            <div className={((size.width > 760) ? "py-24" : "py-10") + " flex justify-center bg-white"}>
                <div className="text-2xl font-medium">
                    <Latex>{question}</Latex>
                </div>
            </div>
        </div>
    )
}

const SolutionInput = ({ solution }: SolutionInputProps) => {
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

export default QuestionDisplay