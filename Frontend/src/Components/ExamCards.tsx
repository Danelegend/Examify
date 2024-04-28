import { Link } from "react-router-dom";
import FavouriteIcon from "../Pages/ExamsPage/Components/FavouriteIcon";
import { useContext, useState } from "react";
import Environment from "../../constants";
import { authClientMiddleWare, readAccessToken } from "../util/utility";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/user-context";
import { ModalContext } from "../context/modal-context";

export type ExamCardProps = {
    school: string,
    year: number,
    type: string,
    subject: string,
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

const ExamCard = ({ school, year, type, difficulty, id, favourite, likes, uploadDate, className, subject }: ExamCardProps) => {
    const [isFavourite, setIsFavourite] = useState(favourite)

    const { accessToken } = useContext(UserContext)
    const { SetDisplayLogin } = useContext(ModalContext)
    
    const postFavourite = () => {
        return fetch(Environment.BACKEND_URL + "/api/exam/" + id.toString() + "/favourite", {
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
    }
    
    const deleteFavourite = () => {
        return fetch(Environment.BACKEND_URL + "/api/exam/" + id.toString() + "/favourite", {
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
    }

    const { mutateAsync: FavouriteMutation } = useMutation<Response>({
        mutationFn: authClientMiddleWare(postFavourite),
        onSuccess: (res) => {
            switch (res.status) {
                case 200:
                    break
                case 403:
                    setIsFavourite(!isFavourite)
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
        mutationFn: deleteFavourite,
        onSuccess: (res) => {
            switch (res.status) {
                case 200:
                    break
                case 403:
                    setIsFavourite(!isFavourite)
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
        
        if (accessToken === null) {
            SetDisplayLogin(true)
            return
        }

        if (isFavourite) {
            UnfavouriteMutation()
        } else {
            FavouriteMutation()
        }
        
        setIsFavourite(!isFavourite)
    }

    return (
        <div className={"flex justify-center " + className}> 
            <div className="w-4/5">
                <Link to={"/exam/" + school + "/" + year + "/" + type}>
                    <div className="relative truncate bg-green-600 rounded-2xl pl-12 pr-7 py-10 break-words">
                        <FavouriteIcon isFavourite={isFavourite} onClick={FavouriteClick} className="absolute bottom-3 right-2 md:right-5"/>
                        <div className="grid-rows-5 text-slate-300">
                            <div className="font-semibold text-xl">
                                {school} {year} {ExamTypeMap[type]} 
                            </div>
                            <div className="ml-2 font-semibold text-l">
                                {subject} 
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