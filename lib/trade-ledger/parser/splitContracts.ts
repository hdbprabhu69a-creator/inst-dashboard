import {extractPageItems} from "../pdf/pageExtractor";
import type {PDFDocumentProxy} from "pdfjs-dist/types/src/display/api";

export interface ContractPages{

    startPage:number;

    endPage:number;

}

export async function splitContracts(
    pdf:PDFDocumentProxy
):Promise<ContractPages[]>{

    const starts:number[]=[];

    for(let pageNo=1;pageNo<=pdf.numPages;pageNo++){

        const page=await pdf.getPage(pageNo);

        const items=await extractPageItems(page);

        const text=items.map(x=>x.text).join(" ");

        if(
            text.includes("CONTRACT NOTE CUM TAX INVOICE")
            ||
            text.includes("Contract Note No:")
        ){
            starts.push(pageNo);
        }

    }

    const contracts:ContractPages[]=[];

    for(let i=0;i<starts.length;i++){

        contracts.push({

            startPage:starts[i],

            endPage:
                i+1<starts.length
                    ?starts[i+1]-1
                    :pdf.numPages

        });

    }

    return contracts;

}

