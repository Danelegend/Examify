import { ReactNode } from "react"
import { MdNavigateNext } from "react-icons/md"
import { Link } from "react-router-dom"

type ButtonSkeletonProps = {
    className?: string,
    link: string,
    children?: ReactNode
}

type LinkButtonProps = {
    link: string,
    className?: string
}

export const NextButton = ({ link, className }: LinkButtonProps) => {
    return (
        <ButtonSkeleton 
            link={link}
            className={className}
            children={
                <div className="flex text-black">
                    <div>
                        Next Question
                    </div>
                    <MdNavigateNext 
                        className="m-auto"
                    />
                </div>
            }
        />
    )
}

export const PreviousButton = ({ link, className }: LinkButtonProps) => {
    return (
        <ButtonSkeleton 
            link={link}
            className={className}
            children={
                <div className="flex text-black">
                    <MdNavigateNext 
                        style={{ transform: "rotate(180deg)" }}
                        className="m-auto"
                    />
                    <div className="">
                        Previous Question
                    </div>
                </div>
            }
        />
    )
}

const ButtonSkeleton = ({ className, link, children }: ButtonSkeletonProps) => {
    className = (className === undefined) ? "" : className

    return (
        <Link to={link}>
            <div className={className}>
                {children}
            </div>
        </Link>
    )
}