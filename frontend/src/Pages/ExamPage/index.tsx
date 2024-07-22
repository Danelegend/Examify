import Environment from "../../../constants"

import { useEffect, useState } from "react"
import ExamDisplay from "./Components/ExamDisplay"
import ExamFullScreenDisplay from "./Components/ExamFullScreenDisplay"
import { Link, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dotSpinner } from 'ldrs';

import { IoMdArrowRoundBack } from "react-icons/io";
import { FetchError, readAccessToken } from "../../util/utility";
import { FetchExam, FetchPermissions, PostRecentlyViewedExam } from "../../api/api"
import Timer from "./Components/Timer"
import CompleteIcon from "./Components/Complete"
import FavouriteIcon from "./Components/Favourite"
import { Helmet } from "react-helmet-async"
import { AdminButton, AdminPanel } from "./Components/AdminOverlay"

const ExamPage = () => {
    const [Fullscreen, SetFullscreen] = useState(false)
    const [DisplayAdminPanel, SetDisplayAdminPanel] = useState(false)

    const { subject, school, year, exam_type } = useParams()

    const queryClient = useQueryClient()

    const onFullScreenExit = () => {
        SetFullscreen(false);
    }

    const { isPending, data, error } = useQuery({
        queryKey: ["exam", school, year, exam_type],
        queryFn: () => FetchExam({
            school: school!,
            year: parseInt(year!),
            exam_type: exam_type!,
            subject: subject!
        })
    })

    const RunRecentlyViewed = async () => {
        PostRecentlyViewedExam({
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
            if (readAccessToken() !== null) {
                RunRecentlyViewed()
            }
        }
    }, [isPending, error])

    dotSpinner.register()

    return (
        <>
        <Helmet>
            <title>{"Examify | " + school + " " + subject + " " + year + " " + exam_type}</title>
            <meta name="description" content={"A practice HSC exam paper for " + subject + " from " + school + " " + year + " " + exam_type}/>
        </Helmet>
        <div className="bg-[#F3F5F8] min-h-screen min-w-screen">
        {
            DisplayAdminPanel ?
            <AdminPanel exam_id={data!.exam_id} 
                        exam_data={{
                                    subject: subject!, 
                                    school: school!, 
                                    year: parseInt(year!), 
                                    exam_type: exam_type!
                                }} 
                        onExit={() => SetDisplayAdminPanel(false)} />
            : null
        }
        {isPending ? 
            <div className="flex justify-center items-center min-h-screen min-w-screen"> 
                <l-dot-spinner
                            size="35"
                            speed="1"
                            color="black"
                            />
            </div> :
        Fullscreen ? <ExamFullScreenDisplay onExit={onFullScreenExit} fileLoc={Environment.BACKEND_URL + "/api/exam/pdf/" + data!.exam_id.toString()} /> :
        <div className="bg-[#F3F5F8] w-full h-full">
            <div className="absolute pt-4 pl-4">
                <Link to = "/exams">
                    <IoMdArrowRoundBack size={30} color="black" className="cursor-pointer"/>
                </Link>
            </div>
            {
                
                data && data !== null ?
                <DisplayExam AdminButtonClicked={() => SetDisplayAdminPanel(true)} exam_id={data.exam_id} />
                : 
                <div className="flex justify-center items-center min-h-screen min-w-screen">
                    <div className="text-2xl">
                        Exam not found
                    </div>
                </div>
            }
        </div>
        }
        </div>
        </>
    )
}

type DisplayExamProps = {
    AdminButtonClicked: () => void
    exam_id: number
}

const DisplayExam = ({ AdminButtonClicked, exam_id }: DisplayExamProps) => {
    return (
        <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 w-full">
                <div className="flex-1"/>
                <ExamDisplay examId={exam_id} />
                <div className="flex-1">
                    <div className="flex justify-center">
                        <ExamControls exam_id={exam_id} AdminButtonClicked={AdminButtonClicked}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

type ExamControlsProps = {
    AdminButtonClicked: () => void
    exam_id: number
}

const ExamControls = ({ exam_id, AdminButtonClicked }: ExamControlsProps) => {
    const AccessToken = readAccessToken()

    const { isPending: permissionsPending, data: permissionsData} = useQuery({
        queryKey: ["Permissions"],
        queryFn: () => FetchPermissions()
    })

    return (
        <div className="flex-col space-y-4">
            <Timer />
            <div className="flex justify-evenly">
                <div className="my-auto">
                    <CompleteIcon exam_id={exam_id}/>
                </div>
                <div className="my-auto">
                    <FavouriteIcon exam_id={exam_id}/>
                </div>
            </div>
            {
                (permissionsPending || permissionsData === undefined || permissionsData?.permissions !== "ADM") ?
                null :
                <div>
                    <AdminButton onClick={AdminButtonClicked}/>
                </div>
            }
        </div>
    )
}

export default ExamPage