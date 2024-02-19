import Environment from "../../../../constants";

import { useEffect, useState } from "react";
import ExamCard, { ExamCardProps } from "./ExamCards";

const ExamDisplay = () => {
    const [Exams, SetExams] = useState<ExamCardProps[]>([]);

    useEffect(() => {
        const loadExams = async () => {
            const data = await (
                await fetch(Environment.BACKEND_URL + "/api/exam/exams",
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        load_start: 0, 
                        load_size: 20, 
                        filter_config: "",
                        sort: "DEFAULT"}),
                    credentials: 'include'
                })
            ).json();

            SetExams(data.map(exam => 
                {
                    return {
                        school: exam.fields.school_name,
                        year: exam.fields.year,
                        type: exam.fields.exam_type,
                        difficulty: 1
            }}))
        }

        loadExams()
    }, []);

    return (
        <div className="px-40 pt-5">
            <div className="bg-slate-900 rounded-lg py-8 px-4">
                <div className="grid grid-cols-3 gap-x-4 gap-y-12">
                    {
                        Exams.map((exam, index) => <ExamCard key={index} school={exam.school} type={exam.type} year={exam.year} difficulty={exam.difficulty}/>)
                    }
                </div>
            </div>
        </div>
    )
}

export default ExamDisplay