import EscapeButton from "./EscapeButton"

type DisplayBarProps = {
    onExit: () => void
}

const DisplayBar = ({ onExit }: DisplayBarProps) => {
    return (
        <div className="bg-slate-700 grid grid-cols-12 py-1">
            <div className="flex col-start-12">
                <EscapeButton onClick={onExit}/>
            </div>
        </div>
    )
}

export default DisplayBar