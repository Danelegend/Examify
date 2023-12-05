import ExamCard from "./ExamCards";

const tempData = Array.from(Array(10).keys());

const ExamDisplay = () => {
    return (
        <div className="px-40 pt-5">
            <div className="bg-slate-900 rounded-lg py-8 px-4">
                <div className="grid grid-cols-3 gap-x-4 gap-y-12">
                    {
                        tempData.map((d) => <ExamCard />)
                    }
                </div>
            </div>
        </div>
    )
}

export default ExamDisplay