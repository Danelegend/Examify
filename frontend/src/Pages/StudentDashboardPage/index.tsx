import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { waveform } from 'ldrs'
import { FetchError, handle403, readAccessToken } from "../../util/utility";
import { FetchUserProfile } from "../../api/api";
import SubjectAnalyticsPieChart from "./Components/UserSubjectAnalyticsPieChart";
import { FavouriteExamsDisplay, RecommendedExamsDisplay } from "./Components/ExamDisplay";
import ExamTimeChart from "./Components/ExamTimeChart";
import RecommendTopics from "./Components/RecommendTopics";


type UserProfile = {
    name: string,
    exams_completed: number,
}


const StudentDashboardPage = () => {
    const [UserProfile, SetUserProfile] = useState<UserProfile | null>(null)
    
    const handleAuthorizationError = handle403()
    
    const { data: userProfileData, isPending: userProfileIsPending, error: userProfileError } = useQuery({
        queryKey: ["UserProfile"],
        queryFn: () => FetchUserProfile(),
    })

    

    useEffect(() => {
        if (!userProfileIsPending) {
            if (userProfileError) {
                console.error(userProfileError)
                
                switch ((userProfileError as FetchError).status) {
                    case 500:
                        break
                    case 403:
                        handleAuthorizationError()
                        break
                    default:
                        break
                }
            } else {
                SetUserProfile({
                    name: userProfileData.name,
                    exams_completed: userProfileData.exams_completed
                })
            }
        }

        
    }, [userProfileData, userProfileIsPending, userProfileError])

    waveform.register()

    

    return (userProfileIsPending) ? 
    <div className="flex min-h-screen min-w-screen justify-center items-center">
        <l-waveform
        size="35"
        stroke="3.5"
        speed="1" 
        color="black" 
        /> 
    </div>
    : 
     (
        <div>
            <div className="text-black text-center text-xl mt-6 font-bold">
                Welcome back {UserProfile?.name}!
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-4 md:mx-32 gap-x-4 gap-y-12 pt-4">
                <div className="col-span-4">
                    <RecommendedExamsDisplay />
                </div>
                <div className="col-span-1">
                    <SubjectAnalyticsPieChart />
                </div>
                <div className="col-span-2">
                    <ExamTimeChart />
                </div>
                <div className="col-span-1">
                    <RecommendTopics />
                </div>
                <div className="col-span-4">
                    <FavouriteExamsDisplay />
                </div>
                
            </div>
        </div>
    )
}

export default StudentDashboardPage;