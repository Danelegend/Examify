import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="text-black">
            <h1>
                Oops you appear to be lost.
            </h1>
            <Link to="/">Return to Home</Link>
        </div>
    )
}

export default NotFoundPage;