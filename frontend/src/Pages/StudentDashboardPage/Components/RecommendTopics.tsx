import { useState } from "react"
import Latex from "react-latex-next"

type TopicRecommendation = {
    subject: string,
    topic: string,
    description: string,
    question_id_link: number,
    question_title: string
}

const TEMP_DATA = [
    {
        subject: "Mathematics",
        topic: "Financial Mathematics",
        description: "You do well in geometric and arithmetic sequences, however application to financial maths can be improved",
        question_id_link: 1,
        question_title: "Annuity Future Value"
    },
    {
        subject: "Maths Extension 1",
        topic: "Integration",
        description: "You have a good understanding of differentiation, however you struggle with integration",
        question_id_link: 15,
        question_title: "Polynomial Integration"
    },
    {
        subject: "Physics",
        topic: "Waves",
        description: "You have a good understanding of mechanics, however you struggle with waves",
        question_id_link: 25,
        question_title: "Wave Interference"
    }
]

const RecommendTopics = () => {
    const [RecommendTopics, SetRecommendTopics] = useState<TopicRecommendation[]>(TEMP_DATA)

    return (
        <div className="border-2 border-black p-2">
            <div className="text-center">
                <h3 className="font-semibold text-2xl mb-2">
                    Recommend Topics
                </h3>
            </div>
            <div className="flex flex-col space-y-2">
                {RecommendTopics.map((topic, index) => {
                    return (
                        <div className="bg-white px-2 py-1" key={index}>
                            <div className="flex flex-col space-y-2 text-sm">
                                <h3 className="text-center font-medium text-base">
                                    {topic.subject + " " + topic.topic}
                                </h3>
                                <p>
                                    {topic.description}
                                </p>
                                <div className="flex space-x-2">
                                    <p>
                                        Consider this question to help:
                                    </p>
                                    <a href={"/question/" + topic.question_id_link.toString()}>
                                        <Latex>
                                            {topic.question_title}
                                        </Latex>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RecommendTopics