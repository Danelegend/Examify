
import { ClickableButton, NavigationButton } from "./NavButton";

const LoggedOutNavbar = () => {
    return (
        <div className="">
            <div className="grid grid-cols-3 gap-16 justify-center px-32">
                <NavigationButton title={"Exams"} link={"/exams"} />
                <ClickableButton title={"Login"} />
                <ClickableButton title={"Register"} />
            </div>
        </div>
    )
}

export default LoggedOutNavbar;