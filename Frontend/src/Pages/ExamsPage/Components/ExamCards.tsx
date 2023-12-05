import { Link } from "react-router-dom";

type ExamCardProps = {
    school: string,
    year: number,
    type: string,
    difficulty: number,
}

const ExamCard = ({ school, year, type, difficulty }: ExamCardProps) => {
    return (
        <div className="flex justify-center"> 
            <div className="w-5/6">
                <Link to={"/exam/freshwater/trial/2023"}>
                    <div className="bg-green-500 rounded-2xl px-16 py-10">
                        <div className="grid-rows-4 text-slate-300">
                            <div className="font-semibold text-lg">
                                School: {school}
                            </div>
                            <div>
                                Year: {year}
                            </div>
                            <div>
                                Type: {type}
                            </div>
                            <div>
                                Difficulty: {difficulty}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default ExamCard;