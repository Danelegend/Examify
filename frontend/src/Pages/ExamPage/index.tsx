import Environment from "../../../constants"

import { useContext, useEffect, useState } from "react"
import ExamDisplay from "./Components/ExamDisplay"
import ExamFullScreenDisplay from "./Components/ExamFullScreenDisplay"
import { Link, useLocation, useParams } from "react-router-dom"
import React from "react"
import { useQuery } from "@tanstack/react-query";

import { IoMdArrowRoundBack } from "react-icons/io";
import { UserContext } from "../../context/user-context";
import { FetchError } from "../../util/utility";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useSearch() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);    
}

const ExamPage = () => {
    const [Fullscreen, SetFullscreen] = useState(false)

    const { accessToken } = useContext(UserContext)
    const { school, year, exam_type } = useParams()

    const onFullScreenExit = () => {
        SetFullscreen(false);
    }

    const fetchExam = () => {
        return fetch(Environment.BACKEND_URL + "/api/exam/" + school + "/" + year?.toString() + "/" + exam_type, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "GET",
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()

            if (res.ok)     {
                return data
            } else {
                throw new FetchError(res)
            }
        })
    }

    const { isPending, data, error } = useQuery({
        queryKey: ["exam", school, year, exam_type],
        queryFn: fetchExam
    })

    const RunRecentlyViewed = async () => {
        fetch(Environment.BACKEND_URL + "/api/exam/" + data.exam_id.toString() + "/recent", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accessToken
            }
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
        (Fullscreen) ? <ExamFullScreenDisplay onExit={onFullScreenExit} fileLoc={data.exam_id} /> :
        <div className="bg-slate-700 w-full h-full">
            <div className="absolute pt-4 pl-4">
                <Link to = "/exams">
                    <IoMdArrowRoundBack size={30} color="black" className="cursor-pointer"/>
                </Link>
            </div>
            <div className="flex items-center justify-center">
                <div className="border-1 border-black">
                    <ExamDisplay examId={data.exam_id} />
                </div>
            </div>
        </div>
    )
}

export default ExamPage