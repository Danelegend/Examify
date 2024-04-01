import Environment from "../../../../constants";
import PdfDisplay from "../../../Components/PdfDisplay/PdfDisplay";

type ExamDisplayProps = {
    examId: number
}

const ExamDisplay = ({ examId }: ExamDisplayProps) => {
    return (
        <PdfDisplay file={Environment.BACKEND_URL + "/api/exam/pdf/" + examId.toString()} />
    )
} 

export default ExamDisplay;