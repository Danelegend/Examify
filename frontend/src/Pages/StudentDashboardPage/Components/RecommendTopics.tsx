import { useEffect, useState } from "react"
import Latex from "react-latex-next"
import { FetchTopicRecommendations } from "../../../api/api"
import { useQuery } from "@tanstack/react-query"

type TopicRecommendation = {
    subject: string,
    topic: string,
    description: string,
    question_id_link: number,
    question_title: string
}

const RecommendTopicDisplay = () => {
    const [RecommendTopics, SetRecommendTopics] = useState<TopicRecommendation[]>([])

    const { data, isPending } = useQuery({
        queryKey: ["Exams", "Recommend"],
        queryFn: () => FetchTopicRecommendations()
    }) 

    useEffect(() => {
        if (!isPending && data) {
            SetRecommendTopics(data.recommendations.map((recommendation) => {
                return {
                    subject: recommendation.subject,
                    topic: recommendation.topic,
                    description: recommendation.description,
                    question_id_link: recommendation.question_id_link,
                    question_title: recommendation.question_title
                }
            }))
        }
    }, [data, isPending])

    return (
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
    )
}

const RecommendTopics = () => {
    const { data, isPending } = useQuery({
        queryKey: ["User", "Permissions"],
        queryFn: () => FetchUserPermissions()
    });
    
    console.log(data)

    return (
        <div className="border-2 border-black p-2">
            <div className="text-center">
                <h3 className="font-semibold text-2xl mb-2">
                    Recommend Topics
                </h3>
            </div>
        {
            isPending || data === undefined ? <div className="flex justify-center">Loading...</div> : 
            data.permissions === "ADM" || data.permissions === "PRE" ? <RecommendTopicDisplay /> : 
            <div className="w-24 h-24 bg-gray-400">
                <div className="flex justify-center">
                    Get Examify+ to access this feature
                </div>
            </div>
        }
        </div>
    )
}

export default RecommendTopics

function FetchUserPermissions(): any {
    throw new Error("Function not implemented.")
}
