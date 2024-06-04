import { MdArrowBackIos } from "react-icons/md"
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards"
import { useEffect, useState } from "react"
import { FetchError, handle403, readAccessToken } from "../../../util/utility"
import { useQuery } from "@tanstack/react-query"
import { waveform } from "ldrs"
import { FetchFavouriteExams } from "../../../api/api"
import { useWindowSize } from "usehooks-ts"

const FavouriteExamsDisplay = () => {
    const [FavouriteExams, SetFavouriteExams] = useState<ExamCardProps[]>([])

    const [FavouritePosition, SetFavouritePosition] = useState<number>(0)

    const handleAuthorizationError = handle403()

    const size = useWindowSize();

    const GetFavouriteIndex = (pos: number) => {
        return (FavouritePosition + pos) % FavouriteExams.length
    }

    const { data: favouriteData, isPending: favouriteIsPending, error: favouriteError } = useQuery({
        queryKey: ["Exams", "FavouriteExams"],
        queryFn: () => FetchFavouriteExams({ token: readAccessToken()! }),
    })

    const handleLeftFavouriteClick = () => {
        if (FavouritePosition === 0) {
            SetFavouritePosition(FavouriteExams.length - 1)
        } else {
            SetFavouritePosition(FavouritePosition - 1)
        }
    }

    const handleRightFavouriteClick = () => {
        if (FavouritePosition === FavouriteExams.length - 1) {
            SetFavouritePosition(0)
        } else {
            SetFavouritePosition(FavouritePosition + 1)
        }
    }

    useEffect(() => {
        if (!favouriteIsPending) {
            if (favouriteError) {
                console.error(favouriteError)
                if (favouriteError instanceof FetchError) {
                    switch ((favouriteError as FetchError).status) {
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
                SetFavouriteExams(favouriteData.exams.map((exam) => {
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
    }, [favouriteIsPending])

    waveform.register();

    return (
        <div className="bg-white col-span-3">
                    <div className="text-black text-center text-xl font-semibold">
                        Favourite Exams
                    </div>
                    <div className="flex justify-center items-center py-4 mx-4">
                        {
                            (favouriteIsPending) ? 
                            <l-waveform
                            size="35"
                            stroke="3.5"
                            speed="1"
                            color="black"
                            /> :
                        <>  
                            {
                                FavouriteExams.length <= 3 ? null :
                                <MdArrowBackIos size={32} color="black" className="cursor-pointer" onClick={handleLeftFavouriteClick}/>
                            }
                            <div className="">
                                <div className="flex overflow-hidden">
                                    <div className="flex">
                                        {FavouriteExams.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex-none w-full"
                                                style={{ width: `${100 / Math.ceil(size.width / 1000)}%` }}
                                            >
                                                <ExamCard {...FavouriteExams[GetFavouriteIndex(index)]} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {
                                FavouriteExams.length <= 3 ? null :
                                <MdArrowBackIos size={32} color="black" style={{transform: "rotate(180deg)"}} className="cursor-pointer" onClick={handleRightFavouriteClick}/>
                            }
                        </>
                        }
                    </div>
                </div>
    )
}

export default FavouriteExamsDisplay