import Environment from "../../../../constants";

import { useContext, useEffect, useState } from "react";
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards";
import { useQuery } from "@tanstack/react-query";
import { FetchError, readAccessToken, removeAccessToken } from "../../../util/utility";
import { UserContext } from "../../../context/user-context";
import DropdownFilter from "./DropdownFilter";

type Filter = {
    schools: string[]
    subjects: string[]
    years: number[]
}

const ExamDisplay = () => {
    const [Exams, SetExams] = useState<ExamCardProps[]>([]);

    const [Filter, SetFilter] = useState<Filter>({
        schools: [],
        subjects: [],
        years: []
    })
    
    const { setAccessToken } = useContext(UserContext)
    
    const accessToken = readAccessToken()

    const fetchSchoolFilters = () => {
        return fetch(Environment.BACKEND_URL + "/api/exams/schools", {
            headers: 
            {  
                'Content-Type': 'application/json',
            },
            method: "GET",
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()

            if (res.ok) {
                return data
            } else {
                throw new FetchError(res, "Bad")
            }
        })
    }

    const fetchSubjectFilters = () => {
        return fetch(Environment.BACKEND_URL + "/api/exams/subjects", {
            headers: 
            {  
                'Content-Type': 'application/json',
            },
            method: "GET",
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()

            if (res.ok) {
                return data
            } else {
                throw new FetchError(res, "Bad")
            }
        })
    }

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
                page: 1,
                filter: Filter
            }),
            credentials: 'include'
        }).then(async (res) => {
            const data = await res.json()
            
            if (res.ok) {
                return data
            } else {
                throw new FetchError(res, "Bad")
            }
        })
    }

    const { data: schoolFilterData, isPending: schoolFilterPending } = useQuery({
        queryKey: ["SchoolFilters"],
        queryFn: fetchSchoolFilters
    })

    const { data: subjectFilterData, isPending: subjectFilterPending } = useQuery({
        queryKey: ["SubjectFilters"],
        queryFn: fetchSubjectFilters
    })

    const { data, isPending, error } = useQuery({
        queryKey: ["Exams"],
        queryFn: fetchExams,
        retry: false
    })

    const UpdateSchools = (arr: string[]) => {
        SetFilter({
            schools: arr,
            subjects: Filter.subjects,
            years: Filter.years
        })
    }

    const UpdateSubjects = (arr: string[]) => {
        SetFilter({
            schools: Filter.schools,
            subjects: arr,
            years: Filter.years
        })
    }

    const UpdateYears = (arr: string[]) => {
        SetFilter({
            schools: Filter.schools,
            subjects: Filter.subjects,
            years: arr.map((year) => parseInt(year))
        })
    }

    useEffect(() =>  {
        if (error) {
            if (error instanceof FetchError) {
                switch((error as FetchError).status) {
                    case 500:
                        break
                    case 403:
                        setAccessToken(null)
                        removeAccessToken()
                        window.location.reload()
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
                return {
                    id: exam.id,
                    school: exam.school_name,
                    year: exam.year,
                    type: exam.type,
                    difficulty: 1,
                    favourite: exam.favourite,
                    uploadDate: exam.upload_date,
                    likes: exam.likes,
                    subject: exam.subject
                }
            }))
        }
    },   [data, isPending, error])

    
    return (
        schoolFilterPending || subjectFilterPending ? <div>Loading</div> : 

        <div className="px-4 pt-5">
            <div className="bg-slate-800 rounded-lg pt-8">
                <div className="border-b mb-6 mx-8">
                    <h1 className="text-3xl font-bold text-white text-center">Exams</h1>
                    <div className="flex justify-center space-x-4 my-2">
                        <DropdownFilter title={"School"} items={schoolFilterData.schools.filter((school) => school !== "")} search={true} update={UpdateSchools}/>
                        <DropdownFilter title={"Subject"} items={subjectFilterData.subjects} search={true} update={UpdateSubjects}/>
                        <DropdownFilter title={"Year"} items={Array.from({ length: 5}, (_, i) => (2024 - i * 1).toString())} update={UpdateYears} search={true}/>
                    </div>  
                </div>
                {
                    isPending ? <div>Loading</div> : 
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-12 bg-slate-800 pt-10 pb-16">
                        {
                            Exams.filter(exam => Filter.schools.length === 0 || Filter.schools.includes(exam.school))
                                 .filter(exam => Filter.subjects.length === 0 || Filter.subjects.includes(exam.subject))
                                 .filter(exam => Filter.years.length === 0 || Filter.years.includes(exam.year))
                                 .map((exam, index) => <ExamCard key={index} school={exam.school} type={exam.type} 
                                                                year={exam.year} difficulty={exam.difficulty} id={exam.id} 
                                                                favourite={exam.favourite} likes={0} uploadDate={exam.uploadDate}
                                                                subject={exam.subject}/>)
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default ExamDisplay