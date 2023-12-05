import Navbar from "./Navbar/Navbar"
import { Title } from "./Title"

export const Header = () => {
    return (
        <div>
            <div className="bg-slate-800 pb-8">
                <Title />
                <Navbar />
            </div>
        </div>
    )
}