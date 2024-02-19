import PdfDisplay from "../../../Components/PdfDisplay/PdfDisplay";

type ExamDisplayProps = {
    link: string
}

const ExamDisplay = ({ link }: ExamDisplayProps) => {
    return (
        <div className="pt-5">
            <div className="">
                <PdfDisplay file={link} />
            </div>
        </div>
    )
}

export default ExamDisplay;