import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="text-black bg-[#F3F5F8] h-screen flex-col flex">
            <div className="m-auto text-center space-y-4">
                <h1>
                    Oops you appear to be lost.
                </h1>
                <Link to="/">Return to Home</Link>
            </div>
        </div>
    )
}

export default NotFoundPage;