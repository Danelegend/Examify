import { Helmet } from "react-helmet-async";
import QuestionsDisplay from "./Components/QuestionsDisplay";


const QuestionsPage = () => {

    return (
        <>
            <Helmet>
                <title>Examify | HSC Practice Questions</title>
            </Helmet>
            <div className="mx-auto">
                <div>
                    
                </div>

                <QuestionsDisplay />
            </div>
        </>
    )
}

export default QuestionsPage;