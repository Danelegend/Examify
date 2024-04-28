import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Environment from "../../../constants";
import { waveform } from 'ldrs'
import { authClientMiddleWare, FetchError, handle403, readAccessToken } from "../../util/utility";
import FavouriteExamsDisplay from "./Components/FavouriteExams";
import RecentExamsDisplay from "./Components/RecentExams";
import { FetchUserProfile } from "../../api/api";


type UserProfile = {
    name: string,
    exams_completed: number,
}


const StudentDashboardPage = () => {
    const [UserProfile, SetUserProfile] = useState<UserProfile | null>(null)
    
    const handleAuthorizationError = handle403()
    
    const { data: userProfileData, isPending: userProfileIsPending, error: userProfileError } = useQuery({
        queryKey: ["UserProfile"],
        queryFn: authClientMiddleWare(FetchUserProfile(readAccessToken()!)),
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
    <div className="flex h-96 min-w-screen justify-center items-center">
        <l-waveform
        size="35"
        stroke="3.5"
        speed="1" 
        color="white" 
        /> 
    </div>
    : 
     (
        <div>
            <div className="text-white text-center text-xl mt-6 font-bold">
                Welcome back {UserProfile?.name}
            </div>
            <div className="grid grid-cols-4 mx-32 gap-4 pt-4">
                <FavouriteExamsDisplay />
                <RecentExamsDisplay />
                <div>
                    <div className="text-white text-xl text-center">
                        Exams Completed: {UserProfile?.exams_completed}
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default StudentDashboardPage;