import { useEffect, useState } from "react"
import Environment from "../../../../constants"
import { FetchError, handle403, readAccessToken } from "../../../util/utility"
import { useMutation, useQuery } from "@tanstack/react-query"
import { TiTick } from "react-icons/ti"
import { MdDelete } from "react-icons/md"

type ReviewDetails = {
    school_name: string | null,
    exam_type: string | null,
    year: number | null,
    subject: string | null,
    file_location: string
}

const SUBJECTS = {
    "Maths Extension 2": "MX2",
    "Maths Extension 1": "MX1",
    "Maths Advanced": "MA",
    "Maths Standard 2": "MS2",
    "Chemistry": "CHEM",
    "Physics": "PHY",
    "Biology": "BIO"
}

const EXAM_TYPE = {
    "Trial Exam": "TRI",
    "HSC Exam": "HSC",
    "Topic Test": "TOP",
    "Half Yearly Exam": "HAE",
    "Term 1 Test": "T_1",
    "Term 2 Test": "T_2",
    "Term 3 Test": "T_3",
    "Term 4 Test": "T_4"
}

type ReviewComponentProps = {
    file_location: string,
    index: number, 
    onSubmit: () => void,
    onDelete: () => void
}

const ReviewComponent = ({ file_location, index, onSubmit, onDelete }: ReviewComponentProps) => {
    const [ReviewDetails, SetReviewDetails] = useState<ReviewDetails>({
        school_name: "",
        exam_type: Object.keys(EXAM_TYPE)[0],
        year: 2024,
        subject: Object.keys(SUBJECTS)[0],
        file_location: file_location
    })

    const handleAuthorizationError = handle403()

    const handleSchoolNameChange = (e) => {
        SetReviewDetails({
            ...ReviewDetails,
            school_name: e.target.value
        })
    }

    const handleExamTypeChange = (e) => {
        console.log(e.target.value)
        SetReviewDetails({
            ...ReviewDetails,
            exam_type: e.target.value
        })
    }

    const handleYearChange = (e) => {
        SetReviewDetails({
            ...ReviewDetails,
            year: e.target.value
        })
    }

    const handleSubjectChange = (e) => {
        console.log(e.target.value)
        SetReviewDetails({
            ...ReviewDetails,
            subject: e.target.value
        })
    }

    const fetchSubmitExam = () => {
        return fetch(Environment.BACKEND_URL + "/api/admin/exam/review/submit", {
            headers: {
                "Authorization": `bearer ${readAccessToken()}`
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                file_location: ReviewDetails.file_location,
                school_name: ReviewDetails.school_name,
                exam_type: ReviewDetails.exam_type,
                year: ReviewDetails.year,
                subject: ReviewDetails!.subject
            
            })
        })
    }

    const fetchDeleteExam = () => {
        return fetch(Environment.BACKEND_URL + "/api/admin/exam/review/delete", {
            headers: {
                "Authorization": `bearer ${readAccessToken()}`
            },
            method: "DELETE",
            credentials: 'include',
            body: JSON.stringify({
                file_location: ReviewDetails.file_location
            })
        })
    }

    const clear = () => {
        SetReviewDetails({
            school_name: "",
            exam_type: Object.keys(EXAM_TYPE)[0],
            year: 2024,
            subject: Object.keys(SUBJECTS)[0],
            file_location: file_location
        })
    }
 
    const { mutateAsync: SubmitExamMutation } = useMutation<Response>({
        mutationFn: fetchSubmitExam,
        onSuccess: (res) => {
            switch (res.status) {
                case 500:
                    break
                case 403:
                    handleAuthorizationError()
                    break
                case 200:
                    break
                default:
                    break
            }
        },
        onError: (e) => {
            console.log("Error")
        }
    })

    const { mutateAsync: DeleteExamMutation } = useMutation<Response>({
        mutationFn: fetchDeleteExam,
        onSuccess: (res) => {
            switch (res.status) {
                case 500:
                    break
                case 403:
                    handleAuthorizationError()
                    break
                case 200:
                    onDelete()
                    clear()
                    break
                default:
                    break
            }
        },
        onError: (e) => {
            console.log("Error")
        }
    })

    const handleSubmit = () => {
        SubmitExamMutation()
        onSubmit()
        clear()
    }

    const handleDelete = () => {
        DeleteExamMutation()
    }
    
    return (
        <div key={index} className={(index % 2 == 0 ? "bg-blue-100" : "bg-yellow-100") + " py-4 px-4"}>
            <div className="grid md:grid-cols-6">
                <div className="content-center">
                    {file_location}
                </div>
                <div className="col-span-1 space-x-4">
                    <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">School</label>
                    <input type="text" onChange={handleSchoolNameChange} value={ReviewDetails.school_name!} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
                <div className="col-span-1 space-x-4">
                    <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Exam Type</label>
                    <select id="exam_type" onChange={handleExamTypeChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        {
                            Object.keys(EXAM_TYPE).map((exam_type, index) => {
                                return <option key={index} value={EXAM_TYPE[exam_type]}>{exam_type}</option>
                            })
                        }
                    </select>
                </div>
                <div className="col-span-1 space-x-4">
                <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                    <input type="number" onChange={handleYearChange} value={ReviewDetails.year!} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                </div>
                <div className="col-span-1 space-x-4">
                    <label className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
                    <select id="subject" onChange={handleSubjectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        {
                            Object.keys(SUBJECTS).map((subject, index) => {
                                return <option key={index} value={SUBJECTS[subject]}>{subject}</option>
                            })
                        }
                    </select>
                </div>
                <div className="flex space-x-10 m-auto">
                    <div onClick={handleSubmit} className="bg-green-200 cursor-pointer">
                        <TiTick size={24} />
                    </div>
                    <div onClick={handleDelete} className="bg-red-200 cursor-pointer">
                        <MdDelete size={24} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const AdminReviewExamPage = () => {
    const [ReviewExams, SetReviewExams] = useState<string[]>([])

    const handleAuthorizationError = handle403()

    const fetchReviewExams = () => {
        return fetch(Environment.BACKEND_URL + "/api/admin/exams/review", {
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
        queryKey: ["ReviewExams"],
        queryFn: fetchReviewExams
    })

    useEffect(() => {
        if (error) {
            if (error instanceof FetchError) {
                switch((error as FetchError).status) {
                    case 500:
                        break
                    case 403:
                        handleAuthorizationError()
                        break
                    default:
                        break
                }
            }
        }

        if (!isPending) {
            SetReviewExams(data.exams.map((exam) => {
                return exam
            }))
        }
    }, [error, isPending])

    return (
        <div className="text-center">
            <h1 className="text-slate-100 my-16">Review Exams Page</h1>

            <div className="mx-16">
                { (ReviewExams.length === 0) ? 
                <div className="text-slate-200 text-3xl mt-48">
                    No Exams to Review
                </div> :
                <ul className="space-y-4">
                    {
                        ReviewExams.map((reviewExam, index) => {
                            return (
                                <li key={index}>
                                    <ReviewComponent file_location={reviewExam} 
                                                    index={index}
                                                    onSubmit={() => {
                                                        SetReviewExams(ReviewExams.filter((exam) => exam !== reviewExam))
                                                    }}
                                                    onDelete={() => {
                                                        SetReviewExams(ReviewExams.filter((exam) => exam !== reviewExam))
                                                    }}
                                    />
                                </li>
                            )
                        })
                    }
                </ul>
                }
            </div>
        </div>
    )
}

export default AdminReviewExamPage;