import { Link } from "react-router-dom";
import FavouriteIcon from "../Pages/ExamsPage/Components/FavouriteIcon";
import { useContext, useState } from "react";
import { readAccessToken } from "../util/utility";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModalContext } from "../context/modal-context";
import { DeleteFavourite, PostFavourite } from "../api/api";

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

const ExamCard = ({ school, year, type, difficulty, id, favourite, likes, uploadDate, className, subject }: ExamCardProps) => {
    const [isFavourite, setIsFavourite] = useState(favourite)

    const { SetDisplayLogin } = useContext(ModalContext)

    const queryClient = useQueryClient()

    const { mutateAsync: FavouriteMutation } = useMutation({
        mutationFn: PostFavourite,
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

    const { mutateAsync: UnfavouriteMutation } = useMutation({
        mutationFn: DeleteFavourite,
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
        
        if (readAccessToken() === null) {
            SetDisplayLogin(true)
            return
        }

        if (isFavourite) {
            UnfavouriteMutation({
                token: readAccessToken()!,
                exam_id: id
            })
        } else {
            FavouriteMutation({
                token: readAccessToken()!,
                exam_id: id
            })
        }
        
        setIsFavourite(!isFavourite)
        queryClient.invalidateQueries({
            queryKey: ["Exams"]
        })
    }

    return (
        <div className={"flex justify-center " + className}> 
            <div className="w-4/5">
                <Link to={"/exam/" + school + "/" + year + "/" + type}>
                    <div className="relative bg-green-600 rounded-2xl pl-12 pr-7 py-10">
                        <FavouriteIcon isFavourite={isFavourite} onClick={FavouriteClick} className="absolute bottom-3 right-2 md:right-5"/>
                        <div className="flex flex-col text-slate-300 break-words">
                            <div className="flex flex-col font-semibold text-xl break-words">
                                {school} {subject} {year} 
                            </div>
                            <div className="ml-2 font-semibold text-l">
                                {type} 
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