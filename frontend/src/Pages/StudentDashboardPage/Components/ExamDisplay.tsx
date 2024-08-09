import { useEffect, useState } from "react"
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards"
import { useWindowSize } from "usehooks-ts"
import { useQuery } from "@tanstack/react-query"
import { TemplateExamsResponse } from "../../../api/types"
import { waveform } from "ldrs"
import { MdArrowBackIos } from "react-icons/md"
import { FetchFavouriteExams, FetchRecentExams, FetchRecommendedExams } from "../../../api/api"
import { readAccessToken } from "../../../util/utility"

type ExamDisplayTemplateProps = {
    fetchExamsFn: () => Promise<TemplateExamsResponse>
    queryKey: string[],
    title: string
}

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

const ExamDisplayTemplate = ({ fetchExamsFn, queryKey, title }: ExamDisplayTemplateProps) => {
    const [Exams, SetExams] = useState<ExamCardProps[]>([])
    const [Position, SetPosition] = useState<number>(0)

    const sizeFactor = 800;

    const size = useWindowSize();

    const { data, isPending, error } = useQuery({
        queryKey: ["Exams"].concat(queryKey),
        queryFn: fetchExamsFn,
    })  

    const handleLeftClick = () => {
        if (Position === 0) {
            SetPosition(Exams.length - 1)
        } else {
            SetPosition(Position - 1)
        }
    }

    const handleRightClick = () => {
        if (Position === Exams.length - 1) {
            SetPosition(0)
        } else {
            SetPosition(Position + 1)
        }
    }

    useEffect(() => {
        if (!isPending) {
            SetExams(data!.exams.map((exam) => {
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
    }, [isPending, data])

    waveform.register();

    return (
        <div className="bg-white">
            <div className="text-black text-center text-xl font-semibold">
                {title}
            </div>
            <div className="flex justify-center items-center py-4 mx-2 md:mx-4">
                {
                    (isPending) ? 
                    <l-waveform
                    size="35"
                    stroke="3.5"
                    speed="1"
                    color="black"
                    /> :
                <>  
                    {
                        Exams.length <= Math.floor(size.width / sizeFactor) ? null :
                        <MdArrowBackIos size={32} color="black" className="cursor-pointer" onClick={handleLeftClick}/>
                    }
                    <div className={("grid-cols-" + Math.ceil(size.width / sizeFactor).toString()) + " grid "}>
                                {
                                    SplitAndShuffleArray(Exams, Math.ceil(size.width / sizeFactor), Position).map(
                                            (exam, index) => 
                                            <div key={index}>
                                                <ExamCard {...exam} className="w-full h-full"/>
                                            </div>
                                    )
                                }
                    </div>
                    {
                        Exams.length <= Math.ceil(size.width / sizeFactor) ? null :
                        <MdArrowBackIos size={32} color="black" style={{transform: "rotate(180deg)"}} className="cursor-pointer" onClick={handleRightClick}/>
                    }
                </>
                }
            </div>
        </div>
    )
}

export const FavouriteExamsDisplay = () => ExamDisplayTemplate({
    fetchExamsFn: () => FetchFavouriteExams(),
    queryKey: ["FavouriteExams"],
    title: "Favourite Exams"
})

export const RecentExamsDisplay = () => ExamDisplayTemplate({
    fetchExamsFn: () => FetchRecentExams(),
    queryKey: ["RecentExams"],
    title: "Recent Exams"
})

export const RecommendedExamsDisplay = () => ExamDisplayTemplate({
    fetchExamsFn: () => FetchRecommendedExams(),
    queryKey: ["RecommendedExams"],
    title: "Recommended Exams"
})