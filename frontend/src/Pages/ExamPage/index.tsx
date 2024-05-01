import Environment from "../../../constants"

import { useContext, useEffect, useState } from "react"
import ExamDisplay from "./Components/ExamDisplay"
import ExamFullScreenDisplay from "./Components/ExamFullScreenDisplay"
import { Link, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { IoMdArrowRoundBack } from "react-icons/io";
import { UserContext } from "../../context/user-context";
import { FetchError, readAccessToken } from "../../util/utility";
import { FetchExam, PostRecentlyViewedExam } from "../../api/api"

const ExamPage = () => {
    const [Fullscreen, SetFullscreen] = useState(false)

    const { accessToken } = useContext(UserContext)
    const { school, year, exam_type } = useParams()

    const queryClient = useQueryClient()

    const onFullScreenExit = () => {
        SetFullscreen(false);
    }

    const { isPending, data, error } = useQuery({
        queryKey: ["exam", school, year, exam_type],
        queryFn: () => FetchExam({
            school: school!,
            year: parseInt(year!),
            exam_type: exam_type!
        })
    })

    const RunRecentlyViewed = async () => {
        PostRecentlyViewedExam({
            token: readAccessToken()!,
            exam_id: data!.exam_id
        })

        queryClient.invalidateQueries({
            queryKey: ["Exams", "RecentExams"]
        })
    }   

    useEffect(() => {
        if (error) {
            if (error instanceof FetchError) {
                switch((error as FetchError).status) {
                    case 500:
                        break
                    case 403:
                        break
                    default:
                        break
                }
            }
        }

        if (!isPending) {
            if (accessToken !== null) {
                RunRecentlyViewed()
            }
        }
    }, [isPending, error])

    return (
        (isPending) ? <div> Loading </div> :
        (Fullscreen) ? <ExamFullScreenDisplay onExit={onFullScreenExit} fileLoc={Environment.BACKEND_URL + "/api/exam/pdf/" + data!.exam_id.toString()} /> :
        <div className="bg-slate-700 w-full h-full">
            <div className="absolute pt-4 pl-4">
                <Link to = "/exams">
                    <IoMdArrowRoundBack size={30} color="black" className="cursor-pointer"/>
                </Link>
            </div>
            <div className="flex items-center justify-center">
                <div className="border-1 border-black">
                    <ExamDisplay examId={data!.exam_id} />
                </div>
            </div>
        </div>
    )
}

export default ExamPage