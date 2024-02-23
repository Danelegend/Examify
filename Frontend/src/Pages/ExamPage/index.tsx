import Environment from "../../../constants"

import { useCallback, useEffect, useState } from "react"
import ExamDisplay from "./Components/ExamDisplay"
import ExamFullScreenDisplay from "./Components/ExamFullScreenDisplay"
import { useLocation } from "react-router-dom"
import React from "react"

import { MdFullscreen, MdFavorite } from "react-icons/md";


type ExamDetails = {
    school: string,
    type: string,
    year: number,
    exam_link: string,
}

const DEFAULT_EXAM_DETAILS: ExamDetails = {
    school: "",
    type: "",
    year: -1,
    exam_link: ""
}

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);    
}

function ParseNumberSafely(num: string | null): number {
    if (num === null) return -1
    
    const parsed = parseInt(num)

    if (Number.isNaN(parsed)) return -1
    return parsed
}

function GetIdFromQueryParams(): number {
    const query = useQuery()

    if (!query.has("id")) {
        return -1
    }

    const exam_id = query.get("id")

    return ParseNumberSafely(exam_id)
}

const ExamPage = () => {
    const [Fullscreen, SetFullscreen] = useState(false)
    const [Loading, SetLoading] = useState(true)
    const [ExamDetails, SetExamDetails] = useState<ExamDetails>(DEFAULT_EXAM_DETAILS)

    const exam_id = GetIdFromQueryParams()

    const onFullScreenExit = () => {
        SetFullscreen(false);
    }

    const onFullScreenClick = () => {
        SetFullscreen(true)
    }

    const RenderedDisplay = useCallback(() => {
        return <ExamDisplay link={ExamDetails.exam_link} />
    }, [ExamDetails])

    useEffect(() => {
        const loadExam = async (exam_id: number) => {
            const exam_data = await (
                await fetch(Environment.BACKEND_URL + "/api/exam/exam?id=" + exam_id.toString(),
                {
                    method: "GET"
                })
            ).json();

            SetExamDetails({
                school: exam_data.school_name,
                type: exam_data.exam_type,
                year: exam_data.year,
                exam_link: exam_data.exam_link
            })

            SetLoading(false)
        }

        loadExam(exam_id)
    }, [])

    return (
        (Loading) ? <div> Loading </div> :
        (Fullscreen) ? <ExamFullScreenDisplay onExit={onFullScreenExit} fileLoc={ExamDetails.exam_link} /> :
        <div>
            <div className="grid grid-cols-12 pt-2">
                <div className="col-span-3 col-start-6 items-center flex">
                    <div className="text-xl">
                        {ExamDetails.school} {ExamDetails.type} {ExamDetails.year}
                    </div>
                </div>

                <div className="col-start-10 justify-between">
                    <div className="pt-4 inline-flex">
                        <MdFavorite size={30} className="cursor-pointer" />
                        <MdFullscreen size={30} onClick={onFullScreenClick} className="cursor-pointer" />   
                    </div>        
                </div>
            </div>
            
            <div className="flex items-center justify-center">
                <div className="pb-2">
                    <RenderedDisplay />
                </div>
            </div>
            
        </div>
    )
}

export default ExamPage