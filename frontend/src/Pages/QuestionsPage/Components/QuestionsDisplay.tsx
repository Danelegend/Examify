import { useEffect, useState } from "react";
import { LoadingQuestionCard, QuestionCard, QuestionCardProps, TitleCard } from "./QuestionCard";
import { DesktopFilter } from "../../../Components/Filter";
import { FetchQuestionSubjects, FetchQuestionTopics } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";

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

type Filter = {
    subject: string[],
    topic: string[],
    grade: number[]
}

const QuestionsDisplay = () => {
    /*
        Questions Display deals with displaying questions as well as filter the filter and the like
    */
   const [Questions, SetQuestions] = useState<QuestionCardProps[]>(DUMMY_QUESTIONS)
   const [isLoading, SetLoading] = useState<boolean>(true)
   const [SortStrategy, SetSortStrategy] = useState<SortStrategy>("ID")

   const [Filter, SetFilter] = useState<Filter>({
         subject: [],
         topic: [],
         grade: []
    })

    const { data: subjectFilterData, isPending: subjectFilterPending } = useQuery({
        queryKey: ["SubjectFilters"],
        queryFn: () => FetchQuestionSubjects()
    })

    const { data: topicFilterData, isPending: topicFilterPending } = useQuery({
        queryKey: ["TopitcFilters"],
        queryFn: () => FetchQuestionTopics()
    })

    const UpdateSubjects = (arr: string[]) => {
        SetFilter({
            ...Filter,
            subject: arr
        })
    }

    const UpdateTopics = (arr: string[]) => {
        SetFilter({
            ...Filter,
            topic: arr
        })
    }

    const UpdateGrades = (arr: string[]) => {
        SetFilter({
            ...Filter,
            grade: arr.map((grade) => parseInt(grade))
        })
    }

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
            <h1 className="text-3xl font-bold text-black text-center mt-16 mb-4">Questions</h1>
            <div className="grid grid-cols-4">
                <div className="col-start-2 col-span-2 flex justify-between my-2">
                    <DesktopFilter title={"Subject"} items={(subjectFilterPending ? [] : subjectFilterData!.subjects)} update={UpdateSubjects} />
                    <DesktopFilter title={"Topic"} items={topicFilterPending ? [] : topicFilterData!.topics} update={UpdateTopics} />
                    <DesktopFilter title={"Grade"} items={Array.from({ length: 5}, (_, i) => (12 - i * 1).toString())} update={UpdateGrades} />
                </div>
            </div>
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