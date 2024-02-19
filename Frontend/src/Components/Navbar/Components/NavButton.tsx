import React from "react";
import { Link } from "react-router-dom";

type NavButtonProps = {
    children: React.ReactNode,
    onClick?: () => void,
}

type ButtonProps = {
    title: string,
    onClick?: () => void,
}

type NavigationButtonProps = 
ButtonProps & {
    link: string,
};


const ButtonStyling = ({ children, onClick } : NavButtonProps) => {
    return (
        <div className="bg-lime-300 rounded-md text-base cursor-pointer" onClick={onClick}>
            {children}
        </div>
    )
}

export const NavigationButton = ({ link, title }: NavigationButtonProps) => {
    return (
        <ButtonStyling>
            <Link to={link}>
                <div className="py-4 text-center text-blue-600">
                    {title}
                </div>
            </Link>
        </ButtonStyling>
    )
}

export const ClickableButton = ({ title, onClick }: ButtonProps) => {
    return (
        <ButtonStyling onClick={onClick}>
            <div className="py-4 text-center text-blue-600">
                {title}
            </div>
        </ButtonStyling>
    )
}