import { Link } from "react-router-dom"

type NavigationButtonProps = {
    link: string,
    title: string,
    dropLinks?: Array<{ title: string, link: string }>
}

export const NavigationButton = ({ link, title, dropLinks }: NavigationButtonProps) => {
    return (
        <div id="dropdownHoverButton" className="group relative cursor-pointer py-2">
            <Link to={link}>
                <div className="text-center text-neutral-700 font-semibold leading-normal tracking-tight cursor-pointer hover:text-neutral-400">
                    {title}
                </div>
            </Link>
            {
                dropLinks && (
                    <div className="absolute w-32 invisible z-50 flex flex-col bg-slate-100 text-gray-800 shadow-xl group-hover:visible -left-1/2 rounded-xl">
                        {
                            dropLinks.map((item, index) => {
                                return (
                                    <Link key={index} to={item.link} className="border-b border-gray-100 py-2 font-semibold hover:bg-neutral-300 text-center rounded-xl">
                                        <div className="text-gray-700 text-xs">
                                            {item.title}
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}