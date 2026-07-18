import {loadPdf} from "../pdf/pdfLoader";

import {parseTradeLedger} from "./parseTradeLedger";
import {parseContractHeader} from "./parseContractHeader";
import {parseSummary} from "./parseSummary";
import {parseCharges} from "./parseCharges";

import {extractPageItems} from "../pdf/pageExtractor";

import type {ContractNote} from "../contractNoteTypes";

export async function parseSingleContractNote(

    pdfPath:string

):Promise<ContractNote>{

    const pdf=await loadPdf(pdfPath);

    if(pdf.numPages!==6){

        throw new Error(

            "Expected a single 6-page Zerodha contract note."

        );

    }

    const page1=await extractPageItems(
        await pdf.getPage(1)
    );

    const page3=await extractPageItems(
        await pdf.getPage(3)
    );

    const page4=await extractPageItems(
        await pdf.getPage(4)
    );

    const trades=await parseTradeLedger(

        pdfPath,

        6,

        6

    );

    return{

        header:parseContractHeader(page1),

        summary:parseSummary(page3),

        charges:parseCharges(page4),

        trades

    };

}
