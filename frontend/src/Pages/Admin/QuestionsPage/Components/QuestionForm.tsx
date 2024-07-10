import { useRef, useState } from "react"
import Latex from "react-latex-next"
import { CiSquareMinus } from "react-icons/ci";
import { FaRegPlusSquare } from "react-icons/fa";
import { PostQuestion } from "../../../../api/api";
import { readAccessToken } from "../../../../util/utility";
import { ImBin } from "react-icons/im";

type QuestionFormData = {
    subject: string,
    topic: string,
    title: string,
    grade: number,
    difficulty: number,
    question: string,
    answers: string[],
    images: File[],
}

type QuestionFormProps = {
    onExit: () => void

}

const QuestionForm = ({ onExit }: QuestionFormProps) => {
    const [QuestionData, SetQuestionData] = useState<QuestionFormData>({
        subject: "",
        topic: "",
        title: "",
        grade: 0,
        difficulty: 0,
        question: "",
        answers: [""],
        images: [],
    })

    const onSubmit = () => {
        if (QuestionData.subject === "" || 
            QuestionData.topic === "" || 
            QuestionData.title === "" || 
            (QuestionData.grade < 1 || QuestionData.grade > 12) || 
            (QuestionData.difficulty < 1 || QuestionData.difficulty > 5) || 
            QuestionData.question === "" || 
            (QuestionData.answers.length === 0 || !QuestionData.answers.every(ans => ans !== ""))
            ) return;

        PostQuestion({ 
            token: readAccessToken()!, 
            request: {
                title: QuestionData.title,
                subject: QuestionData.subject,
                topic: QuestionData.topic,
                grade: QuestionData.grade,
                difficulty: QuestionData.difficulty,
                question: QuestionData.question,
                answers: QuestionData.answers,
                image_locations: QuestionData.images
            }})

        onExit()
    }

    const handleImageUpload = (e) => {
        const file: File = e.target.files[0]

        if (file.type !== "image/png" && file.type !== "image/jpeg") return

        SetQuestionData({
            ...QuestionData,
            images: [...QuestionData.images, file]
        })
    }

    const uploader = useRef<HTMLInputElement>(null)

    return (
        <div className="fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            New Question
                        </h3>
                        <button type="button" onClick={onExit} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                            <div className="text-xl">
                                x
                            </div>
                        </button>
                    </div>
                    
                    <form className="px-4 py-4 md:px-5">
                        <div className="grid gap-4 mb-4 grid-cols-4" key={"Form"}>
                            <div className="col-span-2" key={"Subject"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Subject</label>
                                <input type="text" onChange={(e) => SetQuestionData({...QuestionData, subject: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                            <div className="col-span-2" key={"Topic"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Topic</label>
                                <input type="text" onChange={(e) => SetQuestionData({...QuestionData, topic: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                            <div className="col-span-2" key={"Title"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                                <input type="text" onChange={(e) => SetQuestionData({...QuestionData, title: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                            </div>
                            <div className="col-span-1" key={"Grade"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Grade</label>
                                <input type="number" onChange={(e) => SetQuestionData({...QuestionData, grade: e.target.valueAsNumber})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                            <div className="col-span-1" key={"Difficulty"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Difficulty</label>
                                <input type="number" onChange={(e) => SetQuestionData({...QuestionData, difficulty: e.target.valueAsNumber})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                            </div>
                            <div className="col-span-4" key={"Question"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Question</label>
                                <input type="text" onChange={(e) => SetQuestionData({...QuestionData, question: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                                <div className="mt-2">
                                    <Latex>{QuestionData.question}</Latex>
                                </div>
                            </div>
                            <div className="col-span-2" key={"Upload"}>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Diagrams</label>
                                <input type="file" ref={uploader} className="hidden" onChange={handleImageUpload}/>
                                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 cursor-pointer" onClick={() => {
                                    if (uploader.current !== null) {
                                        uploader.current.click()
                                    }
                                }}>
                                    Upload
                                </div>
                            </div>
                            <div className="col-span-2" key={"Images"}>
                                <div className="grid grid-cols-2 grid-rows-2">
                                    {
                                        QuestionData.images.map((img, index) => 
                                            <div className="col-span-1 row-span-1 cursor-pointer" key={index} onClick={
                                                () => {
                                                    const newImages = [...QuestionData.images]
                                                    newImages.splice(index, 1)
                                                    SetQuestionData({...QuestionData, images: newImages})
                                            }}>
                                                <div className="relative group">
                                                    <img src={URL.createObjectURL(img)} alt="diagram" className="w-full h-full"/>
                                                    <ImBin className="hidden group-hover:block absolute top-1/2 left-1/2" size={24} color="grey"/>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="col-span-4 flex justify-between" key={"Answers"}>
                                <label className="block text-sm font-medium text-gray-900">Answers</label>
                                <FaRegPlusSquare className="my-auto cursor-pointer" color={"green"} onClick={() => SetQuestionData({...QuestionData, answers: [...QuestionData.answers, ""]})}/>
                            </div>
                            {
                                QuestionData.answers.map((ans, index) => 
                                    <>
                                        <div className="col-span-2" key={`1 ${index.toString()}`}>
                                            <input type="text" 
                                                onChange={(e) => {
                                                    const newAnswers = [...QuestionData.answers]
                                                    newAnswers[index] = e.target.value
                                                    SetQuestionData({...QuestionData, answers: newAnswers})
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
                                        </div>
                                        <div className="col-span-2 my-auto flex justify-between" key={`2 ${index.toString()}`}>
                                            <div className="overflow-auto">
                                                <Latex>{ans}</Latex>
                                            </div>
                                            <CiSquareMinus className="my-auto cursor-pointer" size={18} color="red"
                                                onClick={() => {
                                                    const newAnswers = [...QuestionData.answers]
                                                    newAnswers.splice(index, 1)
                                                    SetQuestionData({...QuestionData, answers: newAnswers})
                                                }}/>
                                        </div>
                                    </>
                                )
                            }
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

export default QuestionForm