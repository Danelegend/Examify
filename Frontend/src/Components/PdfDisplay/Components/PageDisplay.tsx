import { useEffect, useRef } from "react";

type PageDisplayProps = {
    page: any,
    scale: number,
}

const PageDisplay = ({ page, scale }: PageDisplayProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!page) return;

        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current
        if (canvas) {
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            }

            page.render(renderContext)
        }
    })
    
    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default PageDisplay