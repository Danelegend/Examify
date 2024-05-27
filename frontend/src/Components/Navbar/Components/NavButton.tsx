import { Link } from "react-router-dom"

export const NavigationButton = ({ link, title }: { link: string, title: string}) => {
    return (
        <div className="">
            <Link to={link}>
                <div className="text-center text-neutral-700 font-semibold leading-normal tracking-tight cursor-pointer hover:text-neutral-400">
                    {title}
                </div>
            </Link>
        </div>
    )
}