import { useRef } from "react";

const FileUploader = ({ handleFile }: { handleFile: (file: File) => void}) => {
    const hiddenFileInput = useRef(null)

    const handleUploadClick = () => {
        hiddenFileInput.current.click()
    }

    const handleFileChange = (e) => {
        const fileUploaded = e.target.files[0]
        handleFile(fileUploaded)
    }

    return (
        <>
            <button onClick={handleUploadClick} className="mx-4 text-center bg-white cursor-pointer text-black text-base">
                Choose a File
            </button>
            <input 
                type="file" 
                ref={hiddenFileInput}
                onChange={handleFileChange}
                style={{display:'none'}}
            />
        </>
    )
}

export default FileUploader;