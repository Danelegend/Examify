import { useContext, useEffect, useRef, useState } from "react";
import ExamCard, { ExamCardProps } from "../../../Components/ExamCards";
import { useQuery } from "@tanstack/react-query";
import { FetchError, readAccessToken, removeAccessToken } from "../../../util/utility";
import { UserContext } from "../../../context/user-context";
import { DesktopFilter, MobileFilter, MobileFilterDisplay, MobileFilterItem } from "./Filter";
import { FetchExams, FetchExamSubjects, FetchSchools } from "../../../api/api";
import { DesktopSort, MobileSort, MobileSortDisplay } from "./Sort";
import { waveform, dotSpinner } from "ldrs"
import { useOnClickOutside, useWindowSize } from "usehooks-ts";

type Filter = {
    schools: string[]
    subjects: string[]
    years: number[]
}

const ExamDisplay = () => {
    const [Exams, SetExams] = useState<ExamCardProps[]>([]);
    const [FilterItems, SetFilteritems] = useState<Map<string, MobileFilterItem>>(new Map())
    const [Filter, SetFilter] = useState<Filter>({
        schools: [],
        subjects: [],
        years: []
    })
    
    const [IsDisplayFilter, SetDisplayFilter] = useState<boolean>(false);
    const [IsDisplaySort, SetDisplaySort] = useState<boolean>(false);
 
    const { setAccessToken } = useContext(UserContext)

    const size = useWindowSize();

    const MobileSortButtonRef = useRef(null)
    const MobileSortDisplayRef = useRef(null)

    useOnClickOutside([MobileSortButtonRef, MobileSortDisplayRef], () => SetDisplaySort(false))

    const MobileFilterButtonRef = useRef(null)
    const MobileFilterDisplayRef = useRef(null)

    useOnClickOutside([MobileFilterButtonRef, MobileFilterDisplayRef], () => SetDisplayFilter(false))

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

        if (!subjectFilterPending) {
            SetFilteritems(FilterItems.set("Subject", {
                items: subjectFilterData!.subjects,
                updateFunction: UpdateSubjects
            }))
        }

        if (!schoolFilterPending) {
            SetFilteritems(FilterItems.set("School", {
                items: schoolFilterData!.schools.filter((school) => school !== ""),
                updateFunction: UpdateSchools
            }))
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

    },   [data, isPending, error, subjectFilterPending, schoolFilterPending])

    waveform.register();
    dotSpinner.register();
    
    FilterItems.set("Year", {
        items: Array.from({ length: 5}, (_, i) => (2024 - i * 1).toString()),
        updateFunction: UpdateYears
    })

    return (
        schoolFilterPending || subjectFilterPending ? 
        <div className="h-screen w-screen flex items-center justify-center">
            <l-dot-spinner
                size="35"
                speed="1"
                color="black"
            />
        </div>
        : 
        <div className="mx-4 mt-5 rounded-lg bg-slate-100">
            <div className="pt-8">
                <div className="border-b-2 mb-6 px-8">
                    <h1 className="text-3xl font-bold text-black text-center">Exams</h1>
                    {
                    (size.width >= 720) ?
                    <div className="grid grid-cols-3">
                        <div className="col-start-2 col-span-1 flex justify-center space-x-4 my-2">
                            <DesktopFilter title={"School"} items={schoolFilterData!.schools.filter((school) => school !== "")} search={true} update={UpdateSchools}/>
                            <DesktopFilter title={"Subject"} items={subjectFilterData!.subjects} search={true} update={UpdateSubjects}/>
                            <DesktopFilter title={"Year"} items={FilterItems.get("Year")!.items} update={FilterItems.get("Year")!.updateFunction} search={true}/>
                        </div>  
                        <div className="col-start-3 col-span-1 flex justify-end my-2 mx-4">
                            <DesktopSort exams={Exams} setExams={SetExams} relevant={isPending ? [] : data!.exams.map(exam => {
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
                    </div> :
                    <div className="flex text-black justify-between items-center my-2">
                        <MobileSort onClick={() => SetDisplaySort(!IsDisplaySort)} ref={MobileSortButtonRef}/>
                        <MobileFilter onClick={() => SetDisplayFilter(!IsDisplayFilter)} ref={MobileFilterButtonRef}/>
                    </div>
                    }  
                </div>
                {
                    (size.width >= 720) ? null :
                    (IsDisplayFilter) ? <MobileFilterDisplay items={FilterItems} ref={MobileFilterDisplayRef}/> :
                    (IsDisplaySort) ? <MobileSortDisplay exams={Exams} setExams={SetExams}
                    relevant={isPending ? [] : data!.exams.map(exam => {
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
                    })} ref={MobileSortDisplayRef}/> :
                    null
                }
                {
                    isPending ? 
                    <div className="flex justify-center">
                        <l-waveform
                            size="35"
                            stroke="3.5"
                            speed="1"
                            color="black"
                        />
                    </div>
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