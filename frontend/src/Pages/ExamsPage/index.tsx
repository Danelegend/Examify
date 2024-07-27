import { useNavigate, useParams } from "react-router-dom";
import { ExamDisplay, SubjectExamDisplay } from "./Components/ExamDisplay";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

export const ExamsPage = () => {
    return (
        <>
        <Helmet>
            <title>Examify | HSC Practice Exams</title>
            <meta name="description" content="The most comprehensive collection of HSC and trial practice exam papers." />
        </Helmet>
        <div>
            <ExamDisplay />
        </div>
        </>
    )
}

export const SubjectExamsPage = () => {
    const { subject } = useParams()

    const navigate = useNavigate();

    if (subject === undefined) navigate('/');

    const [Subject, SetSubject] = useState<string>(subject!)

    useEffect(() => {
        SetSubject(subject!)
    }, [subject])

    return (
        <>
        <Helmet>
            <title>{"Examify | " + subject +  " HSC Practice Exams"}</title>
            <meta name="description" content={"The most comprehensive collection of " + subject + " HSC and trial practice exam papers."} />
        </Helmet>
        <div>
            <SubjectExamDisplay subject={Subject} />
        </div>
        </>
    )
}

