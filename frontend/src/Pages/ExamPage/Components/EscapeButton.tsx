type EscapeButtonProps = {
    onClick: () => void
}

const EscapeButton = ({ onClick }: EscapeButtonProps) => {
    return (
        <div className="">
            <div className="border-2 border-black px-1 py-0 cursor-pointer" onClick={onClick}>
                <div className="text-black text-xs">
                    x
                </div>
            </div>
        </div>
    )
}

export default EscapeButton;