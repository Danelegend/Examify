import { useEffect, useState } from "react";
import { LoadingQuestionCard, QuestionCard, TitleCard } from "./QuestionCard";
import { useQuery } from "@tanstack/react-query";
import { FetchQuestions, FetchQuestionSubjects, FetchQuestionTopics } from "../../../../api/api";
import { readAccessToken } from "../../../../util/utility";
import { DesktopFilter } from "../../../../Components/Filter";
import { FaRegPlusSquare } from "react-icons/fa";

type Question = {
    id: number,
    title: string,
    subject: string,
    topic: string,
    grade: number,
    difficulty: number
}

type SortStrategy = "ASC_DIFF" | "DES_DIFF" | "ID"

type Filter = {
    subject: string[],
    topic: string[],
    grade: number[]
}

type QuestionDisplayProps = {
    onAddNewQuestion: () => void
}

const QuestionsDisplay = ({ onAddNewQuestion }: QuestionDisplayProps) => {
    /*
        Questions Display deals with displaying questions as well as filter the filter and the like
    */
   const [Questions, SetQuestions] = useState<Question[]>([])
   const [SortStrategy, SetSortStrategy] = useState<SortStrategy>("ID")

    const [CurrentPage, SetCurrentPage] = useState<number>(1);
    const itemsPerPage = 100;

   const [Filter, SetFilter] = useState<Filter>({
         subject: [],
         topic: [],
         grade: []
    })

    const { data: questionsData, isPending: questionsPending } = useQuery({
        queryKey: ["Questions"],
        queryFn: () => FetchQuestions({ request: {
            page: CurrentPage,
            page_length: itemsPerPage,
            filter: {
                subjects: Filter.subject,
                topics: Filter.topic,
                grades: Filter.grade
            }
        }})
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

    useEffect(() => {
        if (questionsPending) return

        SetQuestions(questionsData!.questions.map(question => {
            return {
                id: question.id,
                title: question.title,
                subject: question.subject,
                topic: question.topic,
                grade: question.grade,
                difficulty: question.difficulty
            }
        }))
    }, [questionsData, questionsPending])

    useEffect(() => {
        SetCurrentPage(1)
        FetchQuestions({ token: readAccessToken(), 
            request: {
                page: 1,
                page_length: itemsPerPage,
                filter: {
                    subjects: Filter.subject,
                    topics: Filter.topic,
                    grades: Filter.grade
                }
            }
        }).then((data) => {
            SetQuestions([...data.questions.map(question => {
                return {
                    id: question.id,
                    title: question.title,
                    subject: question.subject,
                    topic: question.topic,
                    grade: question.grade,
                    difficulty: question.difficulty
                }
            })])
        })
    }, [Filter])

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (scrollY + windowHeight >= documentHeight - 100) {
          SetCurrentPage(CurrentPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [CurrentPage]);

    const onClickAddNewQuestion = () => {
        onAddNewQuestion()
    }

    return (
        <div>
            <div className="grid grid-cols-3">
                <div className="col-start-2 col-span-1 mx-auto">
                    <h1 className="text-3xl font-bold text-black text-center mt-16 mb-4">Questions</h1>
                </div>
                <div className="flex col-start-3 col-span-1 justify-end items-center mt-14">
                    <FaRegPlusSquare color={"green"} size={18} className="cursor-pointer" onClick={onClickAddNewQuestion}/>
                </div>
            </div>
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
                    questionsPending ?
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