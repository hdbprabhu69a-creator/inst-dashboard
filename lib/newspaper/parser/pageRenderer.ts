import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

export interface RenderedPage {

    pageNumber:number;

    viewportWidth:number;

    viewportHeight:number;

    imageBuffer:Buffer;

}

export async function renderPage(
    pdf:PDFDocumentProxy,
    pageNumber:number
):Promise<RenderedPage>{

    throw new Error(
        "Page renderer implementation pending."
    );

}
