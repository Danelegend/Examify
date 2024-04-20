import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Environment from "../../../constants";
import { waveform } from 'ldrs'
import { authClientMiddleWare, FetchError, handle403, readAccessToken } from "../../util/utility";
import ExamCard, { ExamCardProps } from "../../Components/ExamCards";
import { MdArrowBackIos } from "react-icons/md";


type UserProfile = {
    name: string,
    exams_completed: number,
}


const StudentDashboardPage = () => {
    const [UserProfile, SetUserProfile] = useState<UserProfile | null>(null)
    const [FavouriteExams, SetFavouriteExams] = useState<ExamCardProps[]>([])
    const [RecentExams, SetRecentExams] = useState<ExamCardProps[]>([])
    
    const [FavouritePosition, SetFavouritePosition] = useState<number>(0)
    const [RecentlyViewedPosition, SetRecentlyViewedPosition] = useState<number>(0)

   const accessToken = readAccessToken()

    const handleAuthorizationError = handle403()

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

    const GetFavouriteIndex = (pos: number) => {
        return (FavouritePosition + pos) % FavouriteExams.length
    }

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
    
    const fetchUserProfile = () => {
        return fetch(Environment.BACKEND_URL + "/api/user/profile", {
            headers: {
                'Authorization': 'bearer ' + accessToken
            },
            method: 'GET',
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()

            if (res.ok) {
                return data
            } else {
                throw new FetchError(res)
            }
        })
    }


    const { data: userProfileData, isPending: userProfileIsPending, error: userProfileError } = useQuery({
        queryKey: ["UserProfile"],
        queryFn: authClientMiddleWare(fetchUserProfile),
    })

    const fetchFavouriteExams = () => {
        return fetch(Environment.BACKEND_URL + "/api/exams/favourites", {
            headers: {
                'Authorization': 'bearer ' + accessToken
            },
            method: "GET",
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()

            if (res.ok) {
                return data
            } else {
                throw new FetchError(res)
            }
        })
    }

    const { data: favouriteData, isPending: favouriteIsPending, error: favouriteError } = useQuery({
        queryKey: ["FavouriteExams"],
        queryFn: authClientMiddleWare(fetchFavouriteExams),
    })

    const fetchRecentExams = () => {
        return fetch(Environment.BACKEND_URL + "/api/exams/recents", {
            headers: {
                'Authorization': 'bearer ' + accessToken
            },
            method: "GET",
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()

            if (res.ok) {
                return data
            } else {
                throw new FetchError(res)
            }
        })
    }

    const { data: recentData, isPending: recentIsPending, error: recentError } = useQuery({
        queryKey: ["RecentExams"],
        queryFn: authClientMiddleWare(fetchRecentExams),
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
                        favourite: exam.favourite
                    }
                }))
            }
        }

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
                        favourite: exam.favourite
                    }
                }))
            }
        }
    }, [userProfileData, userProfileIsPending, userProfileError, favouriteData, favouriteIsPending, favouriteError, recentData, recentIsPending, recentError])

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
                <div className="bg-white col-span-3">
                    <div className="text-center text-xl font-semibold">
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
                            <div className="grid grid-cols-1 md:grid-cols-3 grow">
                                {
                                    (FavouriteExams.length === 0) ? 
                                    <div className="text-center md:col-start-2">
                                        No Favourite Exams
                                        <br/>
                                        <br/>
                                        Lets go find some!
                                    </div>:
                                    (FavouriteExams.length === 1) ? <ExamCard {...FavouriteExams[GetFavouriteIndex(0)]}  className="col-start-2"/> :
                                    (FavouriteExams.length === 2) ? 
                                    <>
                                        <ExamCard {...FavouriteExams[GetFavouriteIndex(0)]} />
                                        <ExamCard {...FavouriteExams[GetFavouriteIndex(1)]} />
                                    </> :
                                    <>
                                        <ExamCard {...FavouriteExams[GetFavouriteIndex(0)]} />
                                        <ExamCard {...FavouriteExams[GetFavouriteIndex(1)]} />
                                        <ExamCard {...FavouriteExams[GetFavouriteIndex(2)]} />
                                    </>
                                }

                            </div>
                            {
                                FavouriteExams.length <= 3 ? null :
                                <MdArrowBackIos size={32} color="black" style={{transform: "rotate(180deg)"}} className="cursor-pointer" onClick={handleRightFavouriteClick}/>
                            }
                        </>
                        }
                    </div>
                </div>
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