import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfTextItem{

    text:string;

    x:number;

    y:number;

    width:number;

    height:number;

    fontName:string;

}

export interface PdfPage{

    page:number;

    items:PdfTextItem[];

}

export async function extractPageText(pdfPath:string){

    const pdf=await getDocument({
        url:pdfPath
    }).promise;

    const pages:PdfPage[]=[];

    for(let pageNo=1;pageNo<=pdf.numPages;pageNo++){

        const page=await pdf.getPage(pageNo);

        const content=await page.getTextContent();

        const items:PdfTextItem[]=[];

        for(const obj of content.items as any[]){

            items.push({

                text:obj.str ?? "",

                x:obj.transform?.[4] ?? 0,

                y:obj.transform?.[5] ?? 0,

                width:obj.width ?? 0,

                height:obj.height ?? 0,

                fontName:obj.fontName ?? ""

            });

        }

        pages.push({

            page:pageNo,

            items

        });

    }

    return pages;

}
