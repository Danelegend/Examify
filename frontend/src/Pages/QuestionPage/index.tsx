import { Helmet } from "react-helmet-async"
import { useParams } from "react-router-dom"
import QuestionDisplay from "./Components/QuestionDisplay"
import { NextButton, PreviousButton } from "../../Components/Buttons/MovementButtons"

const QuestionPage = () => {    
    const { id } = useParams()

    return (
        <>
            <Helmet>

            </Helmet>
            <div className="flex flex-col justify-center h-full space-y-16">
                <QuestionDisplay id={Number(id)}/>
                <div className="flex justify-evenly">
                    <PreviousButton link={"/question/" + (Number(id) - 1).toString()} />
                    <NextButton link={"/question/" + (Number(id) + 1).toString()} />
                </div>
            </div>
        </>
    )
}

export default QuestionPage