import type {ContractHeader} from "../contractNoteTypes";
import type {PdfTextItem} from "../pdf/textItems";

function match(text:string,regex:RegExp){

    return text.match(regex)?.[1]?.trim() ?? "";

}

export function parseContractHeader(
    items:PdfTextItem[]
):ContractHeader{

    const text=items.map(i=>i.text).join(" ");

    return{

        contractNoteNo:match(text,/Contract Note No:\s*([A-Z0-9\-\/]+)/i),

        tradeDate:match(text,/Trade Date:\s*([0-9\/]+)/i),

        settlementNo:match(text,/Settlement No:\s*([0-9]+)/i),

        settlementDate:match(text,/Settlement Date:\s*([0-9\/]+)/i),

        clientId:match(text,/\b(BC\d+)\b/),

        clientName:match(text,/BC\d+\s+([A-Z ]+)/)

    };

}

