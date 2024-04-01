import { useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import FileUploader from "./Components/FileUploader";

const UploadPage = () => {
    const size = useWindowSize()

    const [school, setSchool] = useState<string>("")
    const [year, setYear] = useState<number>(2024)
    const [type, setType] = useState<string>("")
    const [grade, setGrade] = useState<number>(12)

    const [file, setFile] = useState<File | null>(null)

    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (file: File) => {
        setFile(file)

        if(file.type !== "application/pdf") {
            setError("Not a PDF")
        } else {
            setError(null)
        }
    }

    return (
        <div className="flex flex-col justify-between gap-y-10">
            <div className="text-white align-middle justify-center mt-4">
                <div className="text-center text-2xl tracking-wide">
                🎓 Join the Movement to Empower Students! 📚
                </div>
                
                <div className="mt-10 md:mx-72">
                    { 
                    (size.height > 768) && (size.width > 1080) ?
                    <p className="break-normal tracking-normal text-center text-balance">
                        At Examify, we believe in the power of collaboration to uplift every student on their educational journey. But we can't achieve this vision alone. We need your help!
                        <br></br>
                        <br></br>
                        Imagine the impact we can make together by sharing past exams and study resources. Your contribution not only supports fellow students but also fosters a culture of accessibility and success in high schools and the HSC.

                        Join us in building a comprehensive repository of resources that will benefit countless students. Together, we can ensure that no student is left behind. Upload your past exams today and be a part of something bigger than yourself!

                        Every exam you share brings us closer to our goal of providing a diverse range of resources for all students. Your support is invaluable. Let's make education accessible for everyone. 
                        <br></br>
                        <br></br>
                    </p> : null
                    }
                    <p className="break-normal tracking-normal text-center">
                        Upload now and be a hero in the student community! 🌟
                    </p>
                </div>
            </div>
            <div className="mx-64">
                <div className="flex flex-col justify-between text-white text-center gap-y-4">
                    <div className="text-2xl">
                        Upload Form
                    </div>
                    <div className="flex flex-row justify-center gap-2">
                        <div className="">
                            <label>School</label>
                            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="School" />
                        </div>
                        <div className="">
                            <label>Year</label>
                            <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Year" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2">
                        <div className="truncate">
                            <label>Exam Type</label>
                            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type" />
                        </div>
                        <div className="">
                            <label>Grade</label>
                            <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Grade" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2 pt-4">
                        <div className="">
                            <FileUploader handleFile={handleFileChange}/>
                        </div>
                        {
                            file ? 
                            <div className="pt-2 text-white">
                                {file.name}
                            </div> : null
                        }
                    </div>
                    
                    
                    <div className="mt-2">
                        <button className="text-black">
                            Upload
                        </button>
                    </div>
                    {
                        error ?
                        <div className="pt-2 text-red-500">
                            {error}
                        </div> : null

                    }
                </div>
            </div>
        </div>
    )
}

export default UploadPage;