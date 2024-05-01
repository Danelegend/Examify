import { MdArrowBackIos } from "react-icons/md";
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards";
import { useEffect, useState } from "react";
import { FetchError, handle403, readAccessToken } from "../../../util/utility";
import { useQuery } from "@tanstack/react-query";
import { FetchRecentExams } from "../../../api/api";

const RecentExamsDisplay = () => {
    const [RecentExams, SetRecentExams] = useState<ExamCardProps[]>([])
    const [RecentlyViewedPosition, SetRecentlyViewedPosition] = useState<number>(0)

    const handleAuthorizationError = handle403()

    const handleUpRecentlyViewedClick = () => {
        if (RecentlyViewedPosition === 0) {
            SetRecentlyViewedPosition(RecentExams.length - 1)
        } else {
            SetRecentlyViewedPosition(RecentlyViewedPosition - 1)
        }
    }

    const handleDownRecentlyViewedClick = () => {
        if (RecentlyViewedPosition === RecentExams.length - 1) {
            SetRecentlyViewedPosition(0)
        } else {
            SetRecentlyViewedPosition(RecentlyViewedPosition + 1)
        }
    }

    const GetRecentlyViewedIndex = (pos: number) => {
        return (RecentlyViewedPosition + pos) % RecentExams.length
    }

    const { data: recentData, isPending: recentIsPending, error: recentError } = useQuery({
        queryKey: ["Exams", "RecentExams"],
        queryFn: () => FetchRecentExams({ token: readAccessToken()! }),
    })

    useEffect(() => {
        if (!recentIsPending) {
            if (recentError) {
                console.log(recentError)

                if (recentError instanceof FetchError) {
                    switch ((recentError as FetchError).status) {
                        case 500:
                            break
                        case 403:
                            handleAuthorizationError()
                            break
                        default:
                            break
                    }
                }
            } else {
                SetRecentExams(recentData.exams.map((exam) => {
                    return {
                        id: exam.id,
                        school: exam.school_name,
                        year: exam.year,
                        type: exam.type,
                        difficulty: 1,
                        favourite: exam.favourite,
                        subject: exam.subject,
                        likes: exam.likes,
                        uploadDate: exam.upload_date
                    }
                }))
            }
        }
    })

    return (
        <div className="bg-blue-500 row-span-3">
                    <div className="text-center text-xl font-semibold py-2">
                        Recently Viewed Exams
                    </div>
                    <div className="flex flex-col gap-3 content-center my-2">
                        {
                            RecentExams.length <= 3 ? null :
                            <MdArrowBackIos size={32} color="black" style={{transform: "rotate(90deg)"}}className="cursor-pointer self-center" onClick={handleUpRecentlyViewedClick}/>
                        }
                    
                        {
                            (RecentExams.length === 0) ? 
                            <div className="text-center">
                                No Recent Exams
                                <br/>
                                <br/>
                                Lets go find some!
                            </div>:
                            (RecentExams.length === 1) ? <ExamCard {...RecentExams[GetRecentlyViewedIndex(0)]} className="col-start-2"/> :
                            (RecentExams.length === 2) ? 
                            <>
                                <ExamCard {...RecentExams[GetRecentlyViewedIndex(0)]} />
                                <ExamCard {...RecentExams[GetRecentlyViewedIndex(1)]} />
                            </> :
                            <>
                                <ExamCard {...RecentExams[GetRecentlyViewedIndex(0)]} />
                                <ExamCard {...RecentExams[GetRecentlyViewedIndex(1)]} />
                                <ExamCard {...RecentExams[GetRecentlyViewedIndex(2)]} />
                            </>
                        }
                        {
                            RecentExams.length <= 3 ? null :
                            <MdArrowBackIos size={32} color="black" style={{transform: "rotate(270deg)"}} className="cursor-pointer self-center" onClick={handleDownRecentlyViewedClick}/>
                        }
                        
                    </div>
                </div>
    )
}

export default RecentExamsDisplay;