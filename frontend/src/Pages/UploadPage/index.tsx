import { useState } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import FileUploader from "./Components/FileUploader";
import { useMutation } from "@tanstack/react-query";
import { ring } from "ldrs";
import { PostExamUpload } from "../../api/api";

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

type UploadFormType = {
    school: string
    year: number
    type: string
    grade: number
    subject: string
    file: File | null
}

const DEFAULT_UPLOAD_FORM: UploadFormType = {
    school: "",
    year: 2024,
    type: "TRI",
    grade: 12,
    subject: "MX2",
    file: null
}

const MAX_FILE_SIZE = 15 * 1000000 // 15 MB

const UploadPage = () => {
    const size = useWindowSize()

    const [UploadForm, SetUploadForm] = useState<UploadFormType>(DEFAULT_UPLOAD_FORM)

    const [error, SetError] = useState<string | null>(null)
    const [success, SetSuccess] = useState<string | null>(null)
    const [IsLoading, SetLoading] = useState<boolean>(false)

    const { mutateAsync: PostExam } = useMutation({
        mutationFn: PostExamUpload,
        onSuccess: (data) => {
            SetError(null)
            SetSuccess("Exam Uploaded Successfully")
            SetUploadForm(DEFAULT_UPLOAD_FORM)
            SetLoading(false)
        },
        onError: (error) => {
            SetSuccess(null)
            SetError(error.message)
            SetLoading(false)
        }
    })

    const handleFileChange = (file: File) => {
        SetUploadForm({...UploadForm, file: file})

        if(file.type !== "application/pdf") {
            SetError("Not a PDF")
        } else if (file.size > MAX_FILE_SIZE) {
            SetError("File is too large")
        } else {
            SetError(null)
        }
    }

    const handleUploadClick = () => {
        if (UploadForm.school === "") {
            SetError("School is required")
            return
        }

        if (UploadForm.file === null) {
            SetError("File is required")
            return
        }

        if (UploadForm.file.type !== "application/pdf") {
            SetError("Not a PDF")
            return
        }

        if (UploadForm.file.size > MAX_FILE_SIZE) {
            SetError("File is too large")
            return
        }

        PostExam({
            request: {
                file: UploadForm.file!,
                school: UploadForm.school,
                year: UploadForm.year,
                type: UploadForm.type,
                grade: UploadForm.grade,
                subject: UploadForm.subject
            } 
        })
        SetLoading(true);
    }

    ring.register()

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
                            <input type="text" onChange={(e) => SetUploadForm({...UploadForm, school: e.target.value})} className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="School" />
                        </div>
                        <div className="">
                            <label>Year</label>
                            <input type="number" onChange={(e) => SetUploadForm({...UploadForm, year: e.target.valueAsNumber})} className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Year" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2">
                        <div className="truncate">
                            <label>Exam Type</label>
                            <select id="exam_type" onChange={(e) => SetUploadForm({...UploadForm, type: e.target.value})} className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2">
                                {
                                    Object.keys(EXAM_TYPE).map((exam_type, index) => {
                                        return <option key={index} value={EXAM_TYPE[exam_type]}>{exam_type}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="">
                            <label>Grade</label>
                            <input type="number" onChange={(e) => SetUploadForm({...UploadForm, grade: e.target.valueAsNumber})} className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="Grade" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center">
                        <div className="truncate">
                            <label>Subject</label>
                            <select id="subject" onChange={(e) => SetUploadForm({...UploadForm, subject: e.target.value})} className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2 ">
                                {
                                    Object.keys(SUBJECTS).map((subject, index) => {
                                        return <option key={index} value={SUBJECTS[subject]}>{subject}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-2 pt-4">
                        <div className="">
                            <FileUploader handleFile={handleFileChange}/>
                        </div>
                        {
                            UploadForm.file ? 
                            <div className="pt-2 text-white">
                                {UploadForm.file.name}
                            </div> : null
                        }
                    </div>
                    
                    
                    <div className="mt-2">
                        {
                            IsLoading ? 
                            <l-ring
                              size="40"
                              stroke="5"
                              bg-opacity="0"
                              speed="2" 
                              color="black" 
                            />
                            :
                            <button className="text-black bg-white" onClick={handleUploadClick}>
                                Upload
                            </button>
                        }
                    </div>
                    {
                        error ?
                        <div className="pt-2 text-red-500">
                            {error}
                        </div> : null

                    }
                    {
                        success ?
                        <div className="pt-2 text-green-400">
                            {success}
                        </div> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default UploadPage;