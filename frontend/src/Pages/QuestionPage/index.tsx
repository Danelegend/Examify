import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"

type Question = {
    subject: string,
    topic: string,
    latexQuestions: string,
    difficulty: number
}

const QuestionPage = () => {
    const [Question, SetQuestion] = useState<Question | null>(null)
    
    const { id } = useParams()

    return (
        <>
            <Helmet>

            </Helmet>
            <div>
                <div>
                    {Question!.subject} {Question!.topic}
                </div>
            </div> 
        </>
    )
}

export default QuestionPage