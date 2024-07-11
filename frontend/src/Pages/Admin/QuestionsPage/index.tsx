import { useState } from "react"
import QuestionsDisplay from "./Components/QuestionsDisplay"
import QuestionForm from "./Components/QuestionForm"


const AdminQuestionsPage = () => {
    const [isNewQuestionDisplayed, SetIsNewQuestionDisplayed] = useState<boolean>(false)

    return (
        <div>
            <div className="flex justify-center">
                {
                    isNewQuestionDisplayed ?
                    <QuestionForm onExit={() => SetIsNewQuestionDisplayed(false)} /> :
                    null
                }
                <QuestionsDisplay onAddNewQuestion={() => SetIsNewQuestionDisplayed(true)}/>
            </div>
        </div>
    )
}

export default AdminQuestionsPage