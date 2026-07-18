import {loadPdf} from "../pdf/pdfLoader";
import {extractPageItems} from "../pdf/pageExtractor";
import {extractTradeRows} from "../pdf/tableExtractor";
import {mapTradeRow} from "./tradeMapper";

import type {TradeRecord} from "../tradeTypes";

export async function parseTradeLedger(

    pdfPath:string,

    startPage:number=1,

    endPage?:number

):Promise<TradeRecord[]>{

    const pdf=await loadPdf(pdfPath);

    endPage ??= pdf.numPages;

    const trades:TradeRecord[]=[];

    for(

        let pageNo=startPage;

        pageNo<=endPage;

        pageNo++

    ){

        const page=await pdf.getPage(pageNo);

        const items=await extractPageItems(page);

        const text=items.map(i=>i.text).join(" ");

        if(!isAnnexurePage(text)){

            continue;

        }

        const rows=extractTradeRows(items);

        for(const row of rows){

            trades.push(
                mapTradeRow(row)
            );

        }

    }

    return trades;

}

export function isAnnexurePage(
    text:string
){

    return(

        text.includes("Annexure A")

        ||

        (

            text.includes("Order No.")

            &&

            text.includes("Trade No.")

            &&

            text.includes("Quantity")

        )

    );

}

