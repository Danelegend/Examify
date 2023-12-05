import { useEffect } from "react";
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

const PdfDisplay = () => {
    const file = '../../../../Abbotsleigh-2021-4U-Trial.pdf'

    useEffect(() => {
        
    }, [])

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        console.log(numPages)
    }

    return (
        <div>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={3} />
            </Document>
        </div>
    )
}

export default PdfDisplay;