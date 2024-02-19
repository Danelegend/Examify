import { Link } from "react-router-dom";

export type ExamCardProps = {
    school: string,
    year: number,
    type: string,
    difficulty: number,
}

const ExamCard = ({ school, year, type, difficulty }: ExamCardProps) => {
    return (
        <div className="flex justify-center"> 
            <div className="w-5/6">
                <Link to={"/exam?id=1"}>
                    <div className="bg-green-500 rounded-2xl pl-12 py-10">
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