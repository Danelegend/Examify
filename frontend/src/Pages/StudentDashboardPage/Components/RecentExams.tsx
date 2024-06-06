import { MdArrowBackIos } from "react-icons/md";
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards";
import { useEffect, useState } from "react";
import { FetchError, handle403, readAccessToken } from "../../../util/utility";
import { useQuery } from "@tanstack/react-query";
import { FetchRecentExams } from "../../../api/api";
import { useWindowSize } from "usehooks-ts";

const SplitAndShuffleArray = (array: ExamCardProps[], size: number, start: number): ExamCardProps[] => {
    var newArr = []

    for (var i = start; i < array.length && newArr.length < size; ++i) {
        newArr.push(array[i])
    }

    for (var i = 0; i < start && newArr.length < size; ++i) {
        newArr.push(array[i])
    }

    return newArr;
}

const RecentExamsDisplay = () => {
    const [RecentExams, SetRecentExams] = useState<ExamCardProps[]>([])
    const [RecentlyViewedPosition, SetRecentlyViewedPosition] = useState<number>(0)

    const size = useWindowSize();

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
            SetRecentExams(recentData!.exams.map((exam) => {
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
    }, [recentIsPending])

    return (
        <div className="bg-blue-500">
                    <div className="text-center text-xl font-semibold py-2">
                        Recently Viewed Exams
                    </div>
                    <div className="flex flex-col gap-3 content-center my-2">
                        {
                            RecentExams.length <= Math.ceil(size.height / 1000) ? null :
                            <MdArrowBackIos size={32} color="black" style={{transform: "rotate(90deg)"}}className="cursor-pointer self-center" onClick={handleUpRecentlyViewedClick}/>
                        }
                    
                        {
                            (RecentExams.length === 0) ? 
                            <div className="text-center">
                                No Recent Exams
                                <br/>
                                <br/>
                                Lets go find some!
                            </div>
                            :
                            <div className="flex-col space-y-6">
                                {
                                    SplitAndShuffleArray(RecentExams, Math.ceil(size.width / 1000), RecentlyViewedPosition).map(
                                        (exam, index) => 
                                            <div key={index}>
                                                <ExamCard {...exam} />
                                            </div>
                                    )
                                }
                            </div>
                            
                        }
                        {
                            RecentExams.length <= Math.ceil(size.height / 1000) ? null :
                            <MdArrowBackIos size={32} color="black" style={{transform: "rotate(270deg)"}} className="cursor-pointer self-center" onClick={handleDownRecentlyViewedClick}/>
                        }
                        <div className="mb-6"/>
                    </div>
                </div>
    )
}

export default RecentExamsDisplay;