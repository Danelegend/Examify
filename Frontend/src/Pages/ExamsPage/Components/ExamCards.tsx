const ExamCard = () => {
    return (
        <div className="flex justify-center"> 
            <div className="w-5/6">
                <div className="bg-green-500 rounded-2xl px-16 py-10">
                    <div className="grid-rows-4">
                        <div className="font-semibold text-lg">
                            School: title
                        </div>
                        <div>
                            Year: 2023
                        </div>
                        <div>
                            Type: Trial
                        </div>
                        <div>
                            Difficulty: 2
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExamCard;