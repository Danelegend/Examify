import { useState } from "react"
import Environment from "../../../../../constants"
import { authClientMiddleWare, readAccessToken } from "../../../../util/utility"
import { useMutation } from "@tanstack/react-query"

const RegistrationScreen2 = ({ changeScreen } : 
    {
        changeScreen: () => void
    }) => {
    const [DOB, SetDOB] = useState<Date | null>(null)

    const [SchoolYear, SetSchoolYear] = useState<number>(-1)
    const [SchoolName, SetSchoolName] = useState<string>("")

    const [Subjects, SetSubjects] = useState<String[]>([])

    const [ResponseMessage, SetResponseMessage] = useState<string | null>(null)

    const accessToken = readAccessToken()

    const putRegistrationData = async () => {
        return fetch(Environment.BACKEND_URL + "/api/auth/profile", {
            method: "PUT",
            headers: {
                "Authorization": "bearer " + accessToken, 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dob: DOB,
                school_year: SchoolYear,
                school: SchoolName,
                subjects: Subjects
            })
        })
    }

    const { mutateAsync: postData } = useMutation({
        mutationFn: authClientMiddleWare(putRegistrationData),
        onSuccess: (data) => {
            changeScreen()
        },
        onError: (error) => {
            console.log(error)
        },
    })

    const handleDOBChange = (e) => {
        SetDOB(e.target.value)
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

        postData()
    }

    return (
        <div>
            <form className="px-4 pt-4 pb-0.5 md:px-5 md:pt-5 md:pb-1">
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Of Birth</label>
                        <input type="date" onChange={handleDOBChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="DOB" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Year</label>
                        <input type="number" onChange={handleSchoolYearChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="School Year" />
                    </div>
                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Name</label>
                        <input type="text" onChange={HandleSchoolNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="School Name" />
                    </div>
                </div>
                <div className="flex justify-center pb-2">
                    <div onClick={handleSubmission} className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
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

export default RegistrationScreen2