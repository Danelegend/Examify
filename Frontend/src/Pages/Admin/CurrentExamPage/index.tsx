import { useEffect, useState } from "react";
import Environment from "../../../../constants";
import { FetchError, readAccessToken } from "../../../util/utility";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md"

type Exam = {
    id: number,
    school: string,
    year: number,
    exam_type: string,
    subject: string,
    file_location: string,
}

type DisplayExamComponentProps = {
    exam: Exam,
    key: number
}

const DisplayExamComponent = ({ exam, key }: DisplayExamComponentProps) => {
    return (
        <div key={key} className={(key % 2 == 0 ? "bg-blue-100" : "bg-yellow-100") + " py-4 px-4"}>
            <div className="grid grid-cols-6">
                <div className="content-center">
                    {exam.school}
                </div>
                <div className="content-center">
                    {exam.year}
                </div>
                <div className="content-center">
                    {exam.exam_type}
                </div>
                <div className="content-center">
                    {exam.subject}
                </div>
                <div className="content-center">
                    {exam.file_location}
                </div>
                <div className="flex m-auto">
                    <div className="bg-red-200 cursor-pointer">
                        <MdDelete size={24} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const AdminCurrentExamPage = () => {
    const [Exams, SetExams] = useState<Exam[]>([])

    const fetchExams = () => {
        return fetch(Environment.BACKEND_URL + "/api/admin/exams/current", {
            headers: {
                "Authorization": `bearer ${readAccessToken()}`
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

    const { data, isPending, error } = useQuery({
        queryKey: ["Exams"],
        queryFn: fetchExams
    })

    useEffect(() => {
        if (error) {
            if (error instanceof FetchError) {
                switch((error as FetchError).status) {
                    case 500:
                        break
                    default:
                        break
                }
            }
        }

        if (!isPending) {
            SetExams(data.exams.map((exam) => {
                return {
                    id: exam.id,
                    school: exam.school,
                    year: exam.year,
                    exam_type: exam.type,
                    subject: exam.subject,
                    file_location: exam.file_location
                }
            }))
        }
    }, [error, isPending])

    return (
        <div className="text-center">
            <h1 className="text-slate-100 my-16">Current Exams Page</h1>

            <div className="mx-16">
                <ul className="space-y-4">
                    {
                        Exams.map((exam, index) => {
                            return (
                                <li key={index}>
                                    <DisplayExamComponent exam={exam} key={index} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default AdminCurrentExamPage;