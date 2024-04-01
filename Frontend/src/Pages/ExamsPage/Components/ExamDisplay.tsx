import Environment from "../../../../constants";

import { useContext, useEffect, useState } from "react";
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../../../context/user-context";
import { FetchError, handleAuthenticationError } from "../../../util/utility";

const ExamDisplay = () => {
    const [Exams, SetExams] = useState<ExamCardProps[]>([]);

    const { accessToken } = useContext(UserContext)

    const RefreshTokenMutation = handleAuthenticationError()

    const fetchExams = () => {
        return fetch(Environment.BACKEND_URL + "/api/exams/", {
            headers: (accessToken === null) ?
            {  
                'Content-Type': 'application/json',
            } :
            {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accessToken
            },
            method: "POST",
            body: JSON.stringify({
                page: 1
            }),
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

    const { data, isPending, error } = useQuery({
        queryKey: ["Exams"],
        queryFn: fetchExams,
    })

    useEffect(() =>  {
        if (error) {
            if (error instanceof FetchError) {
                switch((error as FetchError).status) {
                    case 500:
                        break
                    case 403:
                        RefreshTokenMutation()
                        break
                    default:
                        break
                }
            }

            console.log(error)
            return;
        }

        if (!isPending) {
            SetExams(data.exams.map(exam => {
                console.log(exam)
                return {
                    id: exam.id,
                    school: exam.school_name,
                    year: exam.year,
                    type: exam.type,
                    difficulty: 1,
                    favourite: exam.favourite,
                    uploadDate: exam.upload_date,
                    likes: exam.likes,
                }
            }))
        }
    },   [data, isPending, error])

    return (
        <div className="px-40 pt-5">
            <div className="bg-slate-900 rounded-lg py-8 px-4">
            {
                isPending ? <div>Loading</div> : 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12">
                    {
                        Exams.map((exam, index) => <ExamCard key={index} school={exam.school} type={exam.type} year={exam.year} difficulty={exam.difficulty} id={exam.id} favourite={exam.favourite}/>)
                    }
                </div>
            }
            </div>
        </div>
    )
}

export default ExamDisplay