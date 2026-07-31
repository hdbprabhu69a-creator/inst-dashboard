import type {ContractNote} from "../contractNoteTypes";

export interface ValidationResult{

    valid:boolean;

    errors:string[];

}

export function validateContractNote(
    note:ContractNote
):ValidationResult{

    const errors:string[]=[];

    if(!note.header.contractNoteNo)
        errors.push("Missing contract note number");

    if(!note.header.tradeDate)
        errors.push("Missing trade date");

    if(!note.header.clientId)
        errors.push("Missing client id");

    if(!note.summary.symbol)
        errors.push("Missing symbol");

    if(!note.summary.isin)
        errors.push("Missing ISIN");

    if(note.trades.length===0)
        errors.push("No trades parsed");

    for(const trade of note.trades){

        if(!trade.orderNo)
            errors.push("Trade missing order number");

        if(!trade.tradeNo)
            errors.push("Trade missing trade number");

        if(trade.quantity<=0)
            errors.push(`Invalid quantity for ${trade.tradeNo}`);

        if(trade.price<=0)
            errors.push(`Invalid price for ${trade.tradeNo}`);

    }

    return{

        valid:errors.length===0,

        errors

    };

}

