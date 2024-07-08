import { useEffect, useState } from "react";
import { LoadingQuestionCard, QuestionCard, QuestionCardProps, QuestionCardSkeleton, TitleCard } from "./QuestionCard";

const DUMMY_QUESTIONS: QuestionCardProps[] = [
    {
        id: 1,
        title: "Test",
        subject: "Maths Extension 2",
        topic: "Complex Numbers",
        grade: 12,
        difficulty: 2,
        index: 1
    },
    {
        id: 2,
        title: "Test",
        subject: "Maths Extension 2",
        topic: "Proofs",
        grade: 12,
        difficulty: 5,
        index: 2
    },
    {
        id: 3,
        title: "Test",
        subject: "Maths Extension 2",
        topic: "Vectors",
        grade: 12,
        difficulty: 4,
        index: 3
    },
]

type SortStrategy = "ASC_DIFF" | "DES_DIFF" | "ID"

const QuestionsDisplay = () => {
    /*
        Questions Display deals with displaying questions as well as filter the filter and the like
    */
   const [Questions, SetQuestions] = useState<QuestionCardProps[]>(DUMMY_QUESTIONS)
   const [isLoading, SetLoading] = useState<boolean>(true)
   const [SortStrategy, SetSortStrategy] = useState<SortStrategy>("ID")

    useEffect(() => {
        SetQuestions([...Questions].sort((a, b) => {
            switch (SortStrategy) {
                case "ASC_DIFF":
                    return a.difficulty - b.difficulty
                case "DES_DIFF":
                    return b.difficulty - a.difficulty
                default:
                    return a.id - b.id
            }
        }))
    }, [SortStrategy])

    return (
        <div>
            <ul>
                <li id="title-bar">
                    <TitleCard 
                        onDifficultyClick={() => {
                            if (SortStrategy === "ASC_DIFF") {
                                SetSortStrategy("DES_DIFF")
                            } else {
                                SetSortStrategy("ASC_DIFF")
                            }
                        }}
                    />
                </li>
                {
                    isLoading ?
                    [...Array(30)].fill(0).map((_, index) => {
                        return (
                            <li key={index}>
                                <LoadingQuestionCard index={index}/>
                            </li>
                        )
                    })
                    :
                    <>
                    {
                        Questions.map((question, index) => {
                            return <QuestionCard 
                                id={question.id}
                                title={question.title}
                                subject={question.subject}
                                topic={question.topic}
                                grade={question.grade}
                                difficulty={question.difficulty}
                                index={index}
                            />
                        })
                    }
                    </>
                }
            </ul>
        </div>
    )
}

export default QuestionsDisplay;