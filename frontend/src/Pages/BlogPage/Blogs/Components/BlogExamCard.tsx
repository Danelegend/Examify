import { Link } from "react-router-dom"
import FavouriteIcon from "../../../ExamsPage/Components/FavouriteIcon"
import { useContext, useEffect, useState } from "react"
import { DeleteFavourite, FetchExam, FetchExams, FetchUserFavouritedExam, PostFavourite } from "../../../../api/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ExamTypes } from "../../../../api/types"
import { readAccessToken } from "../../../../util/utility"
import { ModalContext } from "../../../../context/modal-context"

type BlogExamCardProps = {
    school: string,
    year: number,
    type: string,
    className?: string,
    subject: string,
    displaySubject?: boolean,
}

const SUBJECT_COLOR = {
    "Maths Extension 2": "bg-purple-400",
    "Maths Extension 1": "bg-sky-500",
    "Maths Advanced": "bg-green-500",
    "Chemistry": "bg-teal-500"
}

const GetColor: (subject: string) => string = (subject: string) => {
    return (Object.keys(SUBJECT_COLOR).includes(subject)) ? SUBJECT_COLOR[subject] : "bg-orange-500"
}   

const MapTypeToLink: (type: string) => string = (type: string) => {
    switch (type) {
        case "Trial":
            return "Trial Exam"
        default:
            return type
    }
}

const BlogExamCard = ({ school, year, type, className, subject, displaySubject }: BlogExamCardProps) => {
    const [isFavourite, setIsFavourite] = useState(false)

    const { SetDisplayLogin } = useContext(ModalContext)

    const { data, isPending } = useQuery({
        queryKey: [school, subject, year, type],
        queryFn: () => FetchExams({
            request: {
                page: 1,
                page_length: 1,
                filter: {
                    schools: [school],
                    subjects: [subject],
                    years: [year]
                },
                sort: "relevance"
            } 
        })
    })

    const { mutateAsync: FavouriteMutation } = useMutation({
        mutationFn: PostFavourite,
        onSuccess: (res) => {
            switch (res.status) {
                case 200:
                    break
                case 403:
                    setIsFavourite(!isFavourite)
                    break
                default:
                    setIsFavourite(!isFavourite)
                    break
            }
        },
        onError: (e) => {
            console.log(e)
            setIsFavourite(!isFavourite)
        }
    })

    const { mutateAsync: UnfavouriteMutation } = useMutation({
        mutationFn: DeleteFavourite,
        onSuccess: (res) => {
            switch (res.status) {
                case 200:
                    break
                case 403:
                    setIsFavourite(!isFavourite)
                    break
                default:
                    setIsFavourite(!isFavourite)
                    break
            }
        },
        onError: (e) => {
            console.log(e)
            setIsFavourite(!isFavourite)
        }
    })

    const FavouriteClick = async (e: Event) => {
        e.preventDefault()
        
        if (readAccessToken() === null) {
            SetDisplayLogin(true)
            return
        }

        if (isFavourite) {
            UnfavouriteMutation({
                exam_id: data!.exams[0].id
            })
        } else {
            FavouriteMutation({
                exam_id: data!.exams[0].id
            })
        }
        
        setIsFavourite(!isFavourite)
    }

    useEffect(() => {
        if (isPending) return

        setIsFavourite(data!.exams[0].favourite)
    }, [data, isPending])

    return (
        <div className={"flex justify-center h-full " + className}>
            <div className="w-full">
                <Link to={"/exam/" + subject + "/" + school + "/" + year + "/" + MapTypeToLink(type)}>
                    <div className={GetColor(subject) + " h-full relative rounded-2xl pl-12 pr-7 py-10 shadow-lg text-zinc-200"}>
                        <FavouriteIcon isFavourite={isFavourite} className="absolute bottom-3 right-2 md:right-5" onClick={FavouriteClick}/>
                        <div className="flex flex-col break-words">
                            <div className="flex flex-col font-semibold text-xl break-words">
                                {school} {displaySubject ? subject : ""} {type} {year}
                            </div>
                            <div className="ml-2">
                                Uploaded: {data ? data.exams[0].upload_date : ""}
                            </div>
                            <div className="ml-2">
                                Difficulty: {data ? data.exams[0].difficulty : ""}
                            </div>
                            <div className="ml-2">
                                Likes: {data ? data.exams[0].likes : 0}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default BlogExamCard