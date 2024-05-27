import { forwardRef, useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"
import { ExamCardProps } from "../../../Components/ExamCards"

type SortProps = {
    exams: ExamCardProps[],
    setExams: (exams: ExamCardProps[]) => void,
    relevant: ExamCardProps[]
}

const SORT_METHODS = ["Relevance", "Newest", "Oldest", "Most Liked", "Least Liked", "Recently Uploaded"]

const SortItem = ({ method, index, onSelect}: { method: string, index: number, onSelect: () => void }) => {
    return (
        <li key={index} onClick={onSelect}
            className="cursor-pointer hover:bg-gray-100 py-2.5 pr-10 rounded-lg">
            {method}
        </li>
    )
}

const sortExams = (method: string, relevant: Array<ExamCardProps>, exams: Array<ExamCardProps>, setExams: (exams: Array<ExamCardProps>) => void) => {
    const temp = [...exams]
    switch (method) {
        case "Relevance":
            setExams(relevant)
            break
        case "Newest":
            temp.sort((a, b) => new Date(b.year).getTime() - new Date(a.year).getTime())
            setExams(temp)
            break
        case "Oldest":
            temp.sort((a, b) => new Date(a.year).getTime() - new Date(b.year).getTime())
            setExams(temp)
            break
        case "Recently Uploaded":
            temp.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
            setExams(temp)
            break
        case "Most Liked":
            temp.sort((a, b) => b.likes - a.likes)
            setExams(temp)
            break
        case "Least Liked":
            temp.sort((a, b) => a.likes - b.likes)
            setExams(temp)
            break
        default:
            break
    }
}

export const DesktopSort = ({ exams, setExams, relevant }: SortProps) => {
    const [CurrentSort, SetCurrentSort] = useState<string>("Relevance")
    const [IsOpen, SetIsOpen] = useState<boolean>(false)

    const dropdownRef = useRef(null)

    const toggle = () => {
        SetIsOpen(!IsOpen)
    }

    useOnClickOutside(dropdownRef, () => SetIsOpen(false))

    return (
        <div className="flex flex-row items-center space-x-2 text-black">
            <div ref={dropdownRef}>
                <button id="dropdownDefault" data-dropdown-toggle="dropdown"
                    className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                    type="button" onClick={toggle}>
                    {CurrentSort}
                    <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div id="dropdown" className={(IsOpen ? "" : "hidden ") + "absolute z-10 p-3 bg-white rounded-lg shadow"}>
                    <ul className="space-y-2 text-sm pt-3 border-t overflow-auto max-h-48" aria-labelledby="dropdownDefault">
                        {
                            SORT_METHODS.map((sort, index) => (
                                <SortItem key={index} method={sort} index={index} onSelect={() => {
                                    SetCurrentSort(sort)
                                    SetIsOpen(false)
                                    sortExams(sort, relevant, exams, setExams)
                                }}/>
                            ))
                        }
                    </ul>
                </div>
            </div> 

        </div>
    )
}

export const MobileSort = forwardRef(({ onClick }: { onClick: () => void, ref: any }, ref: any) => {
    return (
        <button className="text-black bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
            onClick={onClick} ref={ref}>
            Sort By
                            
            <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>
    )
})

type MobileSortProps = {
    exams: ExamCardProps[],
    setExams: (exams: ExamCardProps[]) => void,
    relevant: ExamCardProps[]
}

export const MobileSortDisplay = forwardRef(({ exams, setExams, relevant }: MobileSortProps, ref: any) => {
    const [CurrentSort, SetCurrentSort] = useState<string>("Relevance")

    const handleSortClick = (sort: string) => {
        sortExams(sort, relevant, exams, setExams)
        SetCurrentSort(sort)
    }

    return (
        <div ref={ref}>
            <ul className="space-y-2">
                {
                    SORT_METHODS.map((sort, index) => 
                        <li key={index} className={((sort === CurrentSort) ? "bg-blue-100 " : "") + "text-black cursor-pointer"}
                            onClick={() => handleSortClick(sort)}>
                            {sort}
                        </li>
                    )
                }
            </ul>
        </div>
    )
})