import { useContext } from "react";
import LoggedOutNavbar from "./Components/LoggedOutNavbar";
import { UserContext } from "../../context/user-context";
import LoggedInNavbar from "./Components/LoggedInNavbar";

const Navbar = () => {
    const { accessToken } = useContext(UserContext);

    return (
        accessToken === null ? <LoggedOutNavbar /> : <LoggedInNavbar /> 
    )
}

export default Navbar;