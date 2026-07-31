import type {ContractCharges} from "../contractNoteTypes";
import type {PdfTextItem} from "../pdf/textItems";

function amount(
    text:string,
    label:string
){

    const r=new RegExp(label+".*?\\(([0-9.]+)\\)","i");

    return Number(r.exec(text)?.[1] ?? 0);

}

export function parseCharges(
    items:PdfTextItem[]
):ContractCharges{

    const text=items.map(i=>i.text).join(" ");

    return{

        brokerage:amount(text,"Brokerage"),

        exchangeCharges:amount(text,"Exchange transaction"),

        igst:amount(text,"IGST"),

        stt:amount(text,"Securities transaction"),

        sebiFees:amount(text,"SEBI turnover"),

        stampDuty:amount(text,"Stamp duty"),

        netAmount:amount(text,"Net amount")

    };

}

