import { useContext } from "react";
import LoggedOutNavbar from "./Components/LoggedOutNavbar";
import { UserContext } from "../../context/user-context";
import LoggedInNavbar from "./Components/LoggedInNavbar";

const Navbar = () => {
    const { accessToken } = useContext(UserContext);

    console.log("Test")

    return (
        accessToken === null ? <LoggedOutNavbar /> : <LoggedInNavbar /> 
    )
}

export default Navbar;