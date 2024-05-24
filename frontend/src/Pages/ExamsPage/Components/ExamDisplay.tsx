import { useContext, useEffect, useState } from "react";
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards";
import { useQuery } from "@tanstack/react-query";
import { FetchError, readAccessToken, removeAccessToken } from "../../../util/utility";
import { UserContext } from "../../../context/user-context";
import DropdownFilter from "./DropdownFilter";
import { FetchExams, FetchExamSubjects, FetchSchools } from "../../../api/api";
import SortBy from "./SortBy";
import { waveform, dotSpinner } from "ldrs"

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


    const { data: schoolFilterData, isPending: schoolFilterPending } = useQuery({
        queryKey: ["SchoolFilters"],
        queryFn: () => FetchSchools()
    })

    const { data: subjectFilterData, isPending: subjectFilterPending } = useQuery({
        queryKey: ["SubjectFilters"],
        queryFn: () => FetchExamSubjects()
    })

    const { data, isPending, error } = useQuery({
        queryKey: ["Exams"],
        queryFn: () => FetchExams({ token: readAccessToken(), 
                            request: { 
                                page: 1, 
                                filter: Filter 
                            }})
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

    waveform.register();
    dotSpinner.register();

    return (
        schoolFilterPending || subjectFilterPending ? 
        <div className="">
            <l-dot-spinner
                size="35"
                speed="1"
                color="black"
            />
        </div>
        : 
        <div className="mx-4 mt-5 rounded-lg bg-slate-100">
            <div className="pt-8">
                <div className="border-b mb-6 mx-8">
                    <h1 className="text-3xl font-bold text-black text-center">Exams</h1>
                    <div className="grid grid-cols-3">
                        <div className="col-start-2 col-span-1 flex justify-center space-x-4 my-2">
                            <DropdownFilter title={"School"} items={schoolFilterData!.schools.filter((school) => school !== "")} search={true} update={UpdateSchools}/>
                            <DropdownFilter title={"Subject"} items={subjectFilterData!.subjects} search={true} update={UpdateSubjects}/>
                            <DropdownFilter title={"Year"} items={Array.from({ length: 5}, (_, i) => (2024 - i * 1).toString())} update={UpdateYears} search={true}/>
                        </div>  
                        <div className="col-start-3 col-span-1 flex justify-end my-2 mx-4">
                            <SortBy exams={Exams} setExams={SetExams} relevant={isPending ? [] : data!.exams.map(exam => {
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
                            })}/>
                        </div>
                    </div>
                </div>
                {
                    isPending ? 
                    <l-waveform
                        size="35"
                        stroke="3.5"
                        speed="1"
                        color="black"
                    />
                    : 
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-12 pt-10 pb-16">
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