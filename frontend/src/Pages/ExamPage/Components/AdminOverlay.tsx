import { useState } from "react"

type AdminButtonProps = {
    onClick: () => void
}

type AdminPanelProps = {
    exam_id: number
    exam_data: ExamData
    onExit: () => void
}

type ExamAdminForm = {
    exam_id: number
    subject: string
    school: string
    year: number
    exam_type: string
}

type ExamData = {
    subject: string
    school: string
    year: number
    exam_type: string
}

export const AdminButton = ({ onClick }: AdminButtonProps) => {
    return (
        <button onClick={onClick} className="">
            Configure Exam
        </button>
    )
}

export const AdminPanel = ({ exam_id, exam_data, onExit }: AdminPanelProps) => {
    const [ExamForm, SetExamForm] = useState<ExamAdminForm>({
        exam_id: exam_id,
        subject: exam_data.subject,
        school: exam_data.school,
        year: exam_data.year,
        exam_type: exam_data.exam_type
    })

    const onSubmit = async () => {

    }
    
    return (
        <div className="fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Edit Exam
                        </h3>
                        <button type="button" onClick={onExit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <div className="text-xl">
                                x
                            </div>
                        </button>
                    </div>
                    
                    <form className="px-4 py-4 md:px-5">
                        <div className="grid gap-4 mb-4 grid-cols-4" key={"Form"}>
                            <div className="col-span-2" key={"school"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">School</label>
                                <input type="text" value={ExamForm.school} onChange={(e) => SetExamForm({...ExamForm, school: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                            <div className="col-span-2" key={"subject"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Subject</label>
                                <input type="text" onChange={(e) => SetExamForm({...ExamForm, subject: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                            <div className="col-span-2" key={"year"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Year</label>
                                <input type="text" onChange={(e) => SetExamForm({...ExamForm, year: e.target.valueAsNumber})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                            </div>
                            <div className="col-span-1" key={"exam_type"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Exam Type</label>
                                <input type="number" onChange={(e) => SetExamForm({...ExamForm, exam_type: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="text-white inline-flex items-center bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer" onClick={onSubmit}>
                                Submit
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}