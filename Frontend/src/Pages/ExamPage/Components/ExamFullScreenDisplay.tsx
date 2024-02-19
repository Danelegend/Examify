import DisplayBar from "./DisplayBar"

type ExamFullScreenDisplayProps = {
    onExit: () => void,
    fileLoc: string,
}

const ExamFullScreenDisplay = ({ onExit, fileLoc }: ExamFullScreenDisplayProps) => {
    
    
    return (
        <div className="h-screen w-screen fixed top-0 bg-blue-400">
            <DisplayBar onExit={onExit}/>
            <div className="flex items-center justify-center h-full">
            <iframe
                title="PDF Viewer"
                className="h-full w-full"
                src={fileLoc}
            ></iframe>
            </div>
            
        </div>
    )
}

export default ExamFullScreenDisplay