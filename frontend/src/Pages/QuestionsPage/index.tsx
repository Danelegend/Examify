import { useState } from "react";
import { Helmet } from "react-helmet-async";
import QuestionCard, { QuestionCardProps } from "../QuestionsPage/Components/QuestionCard";

const DUMMY_QUESTIONS: QuestionCardProps[] = [
    {
        id: 1,
        subject: "Maths Extension 2",
        topic: "Complex Numbers",
        difficulty: 2
    },
    {
        id: 2,
        subject: "Maths Extension 2",
        topic: "Proofs",
        difficulty: 5
    },
    {
        id: 3,
        subject: "Maths Extension 2",
        topic: "Vectors",
        difficulty: 4
    },
]

const QuestionsPage = () => {
    const [isLoading, SetLoading] = useState<boolean>(true)
    const [Questions, SetQuestions] = useState<QuestionCardProps[]>(DUMMY_QUESTIONS);

    return (
        <>
            <Helmet>
                <title>Examify | HSC Practice Questions</title>
            </Helmet>
            <div>
                <div>
                    
                </div>

                <ul>
                    {
                        Questions.map((question, index) => {
                            return (
                                <li key={index}>
                                    <QuestionCard id={question.id} subject={question.subject} topic={question.topic} difficulty={question.difficulty}/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default QuestionsPage;