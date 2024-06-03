import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { useCallback, useMemo, useState } from 'react';
import { dotSpinner } from 'ldrs';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

type PdfDisplayProps = {
    file: string
}

const PdfDisplay = ({ file }: PdfDisplayProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);

    var PDF: PDFDocumentProxy | null = null;
    var scale = 1;

    const renderPage = (pageNumber: number, canvas: HTMLCanvasElement) => {
        if (PDF === null) {
            return
        }

        PDF.getPage(pageNumber).then((page) => {
            let viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
        })
    }

    const pdfDocument = useMemo(() => pdfjs.getDocument(file), [file])

    const displayPdf = useCallback(() => pdfDocument.promise.then((pdf) => {
        PDF = pdf;
        let viewer = document.getElementById('pdf-viewer');
        for (let page = 1; page <= pdf.numPages; page++) {
            let canvas = document.createElement("canvas");
            canvas.className = 'pdf-page-canvas';
            viewer?.appendChild(canvas);
            renderPage(page, canvas);
        }
        setLoading(false)
    }), [file])

    displayPdf()

    dotSpinner.register()

    return (
        <div>
            {
                (isLoading) ? 
                <div className='flex h-screen justify-center'> 
                    <div className="m-auto">
                        <l-dot-spinner
                        size="35"
                        speed="1"
                        color="black"
                        /> 
                    </div>
                </div> :
                <div id='pdf-viewer' className='h-screen overflow-y-auto'></div>
            }
        </div>
    )
}

export default PdfDisplay;
