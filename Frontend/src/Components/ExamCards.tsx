import { Link } from "react-router-dom";
import FavouriteIcon from "../Pages/ExamsPage/Components/FavouriteIcon";
import { useContext, useState } from "react";
import Environment from "../../constants";
import { handleAuthenticationError, readAccessToken } from "../util/utility";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/user-context";
import { ModalContext } from "../context/modal-context";

export type ExamCardProps = {
    school: string,
    year: number,
    type: string,
    difficulty: number,
    id: number,
    favourite: boolean,
    likes: number,
    uploadDate: string,
    className?: string
}

const ExamTypeMap = {
    "TRI" : "Trial Exam",
    "HSC" : "HSC Exam",
    "TOP" : "Topic Test",
    "HAF" : "Half Yearly Exam",
    "T_1" : "Term 1 Exam",
    "T_2" : "Term 2 Exam",
    "T_3" : "Term 3 Exam",
    "T_4" : "Term 4 Exam"
}

const ExamCard = ({ school, year, type, difficulty, id, favourite, likes, uploadDate, className }: ExamCardProps) => {
    const [isFavourite, setIsFavourite] = useState(favourite)

    const { accessToken } = useContext(UserContext)
    const { SetDisplayLogin } = useContext(ModalContext)

    const RefreshTokenMutation = handleAuthenticationError()
    
    const { mutateAsync: FavouriteMutation } = useMutation<Response>({
        mutationFn: () => {
            return fetch(Environment.BACKEND_URL + "/api/user/favourite", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + readAccessToken()
                },
                method: "POST",
                body: JSON.stringify({
                    exam_id: id
                }),
                credentials: 'include'
            })
        },
        onSuccess: (res) => {
            switch (res.status) {
                case 200:
                    break
                case 403:
                    setIsFavourite(!isFavourite)
                    RefreshTokenMutation()
                    break
                default:
                    setIsFavourite(!isFavourite)
                    break
            }
        },
        onError: (e) => {
            console.log(e)
            setIsFavourite(!isFavourite)
        }
    })

    const { mutateAsync: UnfavouriteMutation } = useMutation<Response>({
        mutationFn: () => {
            return fetch(Environment.BACKEND_URL + "/api/user/favourite", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + readAccessToken()
                },
                body: JSON.stringify({
                    exam_id: id
                }),
                method: "DELETE",
                credentials: 'include'
            })
        },
        onSuccess: (res) => {
            switch (res.status) {
                case 200:
                    break
                case 403:
                    setIsFavourite(!isFavourite)
                    RefreshTokenMutation()
                    break
                default:
                    setIsFavourite(!isFavourite)
                    break
            }
        },
        onError: (e) => {
            console.log(e)
            setIsFavourite(!isFavourite)
        }
    })

    const FavouriteClick = (e: Event) => {
        e.preventDefault()
        if (accessToken === null) SetDisplayLogin(true)

        if (isFavourite) {
            UnfavouriteMutation()
        } else {
            FavouriteMutation()
        }
        
        setIsFavourite(!isFavourite)
    }
    
    return (
        <div className={"flex justify-center " + className}> 
            <div className="w-5/6">
                <Link to={"/exam/" + school + "/" + year + "/" + type}>
                    <div className="relative truncate bg-green-500 rounded-2xl pl-12 py-10">
                        <FavouriteIcon isFavourite={isFavourite} onClick={FavouriteClick} className="absolute bottom-3 right-2 md:right-5"/>
                        <div className="grid-rows-4 text-slate-300">
                            <div className="font-semibold text-xl">
                                {school} {year} {ExamTypeMap[type]} 
                            </div>
                            <div className="ml-2">
                                Uploaded: {uploadDate}
                            </div>
                            <div className="ml-2">
                                Difficulty: {difficulty}
                            </div>
                            <div className="ml-2">
                                Likes: {likes}
                            </div>
                        </div>
                        
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default ExamCard;