import { useState } from "react"
import QuestionsDisplay from "./Components/QuestionsDisplay"
import QuestionForm from "./Components/QuestionForm"


const AdminQuestionsPage = () => {
    const [isNewQuestionDisplayed, SetIsNewQuestionDisplayed] = useState<boolean>(false)

    return (
        <div>
            <div className="mx-96">
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