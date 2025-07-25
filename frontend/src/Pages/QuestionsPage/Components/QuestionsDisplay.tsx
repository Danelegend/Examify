import { useEffect, useState } from "react";
import { LoadingQuestionCard, QuestionCard, TitleCard } from "./QuestionCard";
import { DesktopFilter } from "../../../Components/Filter";
import { FetchQuestions, FetchQuestionSubjects, FetchQuestionTopics } from "../../../api/api";
import { useQuery } from "@tanstack/react-query";
import { readAccessToken } from "../../../util/utility";

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

const QuestionsDisplay = () => {
    /*
        Questions Display deals with displaying questions as well as filter the filter and the like
    */
   const [Questions, SetQuestions] = useState<Question[]>([])
   const [SortStrategy, SetSortStrategy] = useState<SortStrategy>("ID")

   const [Subjects, SetSubjects] = useState<string[]>([])

    const [CurrentPage, SetCurrentPage] = useState<number>(1);
    const itemsPerPage = 50;

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
        queryKey: ["SubjectFilters", "Questions"],
        queryFn: () => FetchQuestionSubjects()
    })

    const { data: topicFilterData, isPending: topicFilterPending } = useQuery({
        queryKey: ["TopitcFilters", "Questions", ...Subjects],
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
        if (subjectFilterPending) return

        SetSubjects(subjectFilterData!.subjects)
    }, [subjectFilterData, subjectFilterPending])

    useEffect(() => {
        FetchQuestions({
            request: {
                page: CurrentPage,
                page_length: itemsPerPage,
                filter: {
                    subjects: Filter.subject,
                    topics: Filter.topic,
                    grades: Filter.grade
                }
            }}).then((data) => {
                SetQuestions([...Questions, ...data.questions.map(question => {
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
    }, [CurrentPage])

    useEffect(() => {
        SetCurrentPage(1)
        FetchQuestions({ 
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

    return (
        <div>
            <h1 className="text-3xl font-bold text-black text-center mt-16 mb-4">Questions</h1>
                <div className="flex justify-center my-2">
                    <div className="flex space-x-4">
                        <DesktopFilter title={"Subject"} items={subjectFilterPending ? [] : subjectFilterData!.subjects} update={UpdateSubjects} />
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
                                key={index}
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