export type QuestionCardProps = {
    id: number,
    subject: string,
    topic: string,
    difficulty: number,
}

const QuestionCard = ({ id, subject, topic, difficulty }: QuestionCardProps) => {
    return (
        <div key={id} className="flex bg-red-300">
            <div>
                {id}.
            </div>
            <div>
                {subject}
            </div>
            <div>
                {topic}
            </div>
        </div>
    )
}

export default QuestionCard;