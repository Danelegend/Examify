import { ClickableButton, NavigationButton } from "./NavButton";

const LoggedInNavbar = () => {
    const handleLogout = () => {
        return
    }

    return (
        <div>
            <div className="pt-3 pb-4">
                <div className="grid grid-cols-7 gap-4 justify-center pr-16 pl-10">
                    <div className="col-span-2 text-xl">
                        Examify
                    </div>
                    <div className="col-start-5">
                        <NavigationButton title={"Exams"} link={"/exams"} />
                    </div>
                    <div className="col-start-6">
                        <NavigationButton title={"Saved"} link={"/saved"} />
                    </div>
                    <div className="col-start-7">
                        <ClickableButton title={"Logout"} onClick={handleLogout} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoggedInNavbar;