import { ReactNode } from "react"
import { FaSort } from "react-icons/fa"
import { Link } from "react-router-dom"

export type QuestionCardProps = {
    id: number,
    title: string,
    subject: string,
    topic: string,
    grade: number,
    difficulty: number,
    index: number
}

type TitleCardProps = {
    onDifficultyClick: () => void
}

export const QuestionCard = ({ id, title, subject, topic, grade, difficulty, index }: QuestionCardProps) => {
    const bgColor = index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"
    const textColor = "black"

    return (
        <Link to={"/question/" + id.toString()}>
            <QuestionCardSkeleton
                col1={
                    <div>
                        {title}
                    </div>
                }
                col2={
                    <div>
                        {subject}
                    </div>
                }
                col3={
                    <div>
                        {topic}
                    </div>
                }
                col4={
                    <div>
                        {grade.toString()}
                    </div>
                }
                col5={
                    <div>
                        {difficulty.toString()}
                    </div>
                }
                className={bgColor + " text-black text-base text font-normal"}
            />
        </Link>
    )
}

export const LoadingQuestionCard = ({ index }: { index: number }) => {
    const bgColor = index % 2 === 0 ? "bg-gray-200" : "bg-gray-300"

    return (
        <QuestionCardSkeleton 
            col1={<></>}
            col2={<></>}
            col3={<></>}
            col4={<></>}
            col5={<></>}
            className={bgColor}
        />
    )
}

type QuestionCardSkeletonProps = {
    col1: ReactNode,
    col2: ReactNode,
    col3: ReactNode,
    col4: ReactNode,
    col5: ReactNode,
    className?: string
}

export const QuestionCardSkeleton = ({ col1, col2, col3, col4, col5, className }: QuestionCardSkeletonProps) => {
    /*
        We want the question card to look similar to leetcode's question card.

        That being we have 4 colums:
            - Subject
            - Topic
            - Grade
            - Difficulty
    */
    className = className === undefined ? "" : className

    return (
        <div className={className + " flex odd:bg-layer-1 even:bg-overlay-1 py-4 px-4"}>
            <div className="w-[260px]">
                {col1}
            </div>
            <div className="w-[260px]">
                {col2}
            </div>
            <div className="w-[260px]">
                {col3}
            </div>
            <div className="w-[100px]">
                {col4}
            </div>
            <div className="w-[84px]">
                {col5}
            </div>
        </div>
    )
}

export const TitleCard = ({ onDifficultyClick }: TitleCardProps) => {
    return (
        <QuestionCardSkeleton
            className="border-b border-gray-500"
            col1={
                <div>
                    Title
                </div>
            }
            col2={
                <div>
                    Subject
                </div>
            }
            col3={
                <div>
                    Topic
                </div>
            }
            col4={
                <div>
                    Grade
                </div>
            }
            col5={
                <div className="flex space-x-2 cursor-pointer" onClick={onDifficultyClick}>
                    <div>
                        Difficulty
                    </div>
                    <div className="m-auto">
                        <FaSort />
                    </div>
                </div>
            }/>
    )
}