import { useState } from "react"
import { readAccessToken } from "../../../../util/utility"
import { useMutation } from "@tanstack/react-query"
import { EditUserProfileData } from "../../../../api/api"

const SUBJECTS = [
    "Maths Extension 2",
    "Maths Extension 1",
    "Maths Advanced",
    "Maths Standard 2",
    "Maths Standard 1",
    "English Extension 2",
    "English Extension 1",
    "English Advanced",
    "English Standard",
    "Science Extension",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Business Studies",
    "Legal Studies",
    "Modern History",
    "Ancient History",
    "Geography",
    "PDHPE",
    "Software Design and Development",
    "Information Processes and Technology",
    "Engineering Studies",
    "Visual Arts",
    "Music Extension",
    "Music 2",
    "Music 1",
    "Drama",
    "Design and Technology",
    "Textiles and Design",
    "Hospitality",
    "Food Technology",
    "Agriculture",
    "Industrial Technology"
] as const
 
const RegistrationScreen2 = ({ changeScreen } : 
    {
        changeScreen: () => void
    }) => {
    const [DOB, SetDOB] = useState<Date | null>(null)

    const [SchoolYear, SetSchoolYear] = useState<number>(-1)
    const [SchoolName, SetSchoolName] = useState<string>("")
    const [Subjects, SetSubjects] = useState<string[]>([])

    const [ResponseMessage, SetResponseMessage] = useState<string | null>(null)

    const [SelectedSubject, SetSelectedSubject] = useState<typeof SUBJECTS[number]>(SUBJECTS[0])

    const { mutateAsync: postData } = useMutation({
        mutationFn: EditUserProfileData,
        onSuccess: (data) => {
            changeScreen()
        },
        onError: (error) => {
            console.log(error)
        },
    })

    const handleDOBChange = (e) => {
        SetDOB(e.target.valueAsDate)
    }

    const handleSchoolYearChange = (e) => {
        SetSchoolYear(e.target.value)
    }

    const HandleSchoolNameChange = (e) => {
        SetSchoolName(e.target.value)
    }

    const handleSubmission = () => {
        if (DOB === null) {
            SetResponseMessage("Provide a date of birth")
            return
        }

        if (SchoolYear < 1 || SchoolYear > 12) {
            SetResponseMessage("School Year must be between 1 and 12")
            return
        }

        if (SchoolName === "") {
            SetResponseMessage("Provide a school name")
            return
        }

        postData({
            token: readAccessToken()!,
            request: {
                dob: DOB,
                school_year: SchoolYear,
                school: SchoolName,
                subjects: Subjects
            }
        })
    }

    return (
        <div>
            <form className="px-4 pt-4 pb-0.5 md:px-5 md:pt-5 md:pb-1">
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Date Of Birth</label>
                        <input type="date" onChange={handleDOBChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="DOB" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900">School Year</label>
                        <input type="number" onChange={handleSchoolYearChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="School Year" />
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900">School Name</label>
                        <input type="text" onChange={HandleSchoolNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="School Name" />
                    </div>
                    <div className="col-span-2 flex gap-x-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Subjects</label>
                            <div className="grid grid-cols-3 gap-x-4">
                                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 col-span-2" onChange={(e) => SetSelectedSubject(e.target.value)}>
                                    {
                                        SUBJECTS.map((subject) => {
                                            return (
                                                <option key={subject} value={subject}>{subject}</option>
                                            )
                                        })
                                    }
                                </select>
                                <div className="rounded-lg bg-blue-600 flex cursor-pointer" onClick={() => {
                                    if (!Subjects.includes(SelectedSubject)) {SetSubjects([...Subjects, SelectedSubject])}}}>
                                    <div className="text-center text-white text-sm px-3 py-1 m-auto">
                                        Add Subject
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="flex flex-wrap col-span-2">
                        {
                            Subjects.map((subject) => {
                                return (
                                    <SubjectBubble subject={subject} removeSubject={() => SetSubjects(Subjects.filter((s) => s !== subject))}/>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex justify-center pb-2">
                    <div onClick={handleSubmission} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer">
                       <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                        Continue
                    </div>
                </div>
                    {
                        (ResponseMessage === null) ? null : 
                        <div className="text-red-600 text-center pb-1">
                            {ResponseMessage}
                        </div>
                    }
            </form>
        </div>
    )
}

const SubjectBubble = ({ subject, removeSubject } : { subject: string, removeSubject: () => void }) => {
    return (
        <div key={subject} className="bg-blue-700 text-white rounded-lg px-2.5 py-1.5 text-xs me-2 mb-2 cursor-pointer" onClick={removeSubject}>
            {subject}
        </div>
    )
}

export default RegistrationScreen2