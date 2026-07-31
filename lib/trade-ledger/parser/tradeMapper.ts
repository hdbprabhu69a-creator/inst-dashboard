import type {PdfTradeRow} from "../pdf/tableExtractor";
import type {TradeRecord} from "../tradeTypes";

function parseMoney(value:string):number{

    const cleaned=value
        .replace(/[(),]/g,"")
        .replace(/[^\d.-]/g,"");

    return Number(cleaned);

}

function splitSecurity(value:string){

    const [symbolPart,isin=""]=value.split("/");

    const symbol=symbolPart.replace(/-EQ$/,"");

    return{

        symbol,
        isin

    };

}

export function mapTradeRow(
    row:PdfTradeRow
):TradeRecord{

    const security=splitSecurity(row.security);

    return{

        orderNo:row.orderNo,

        orderTime:row.orderTime,

        tradeNo:row.tradeNo,

        tradeTime:row.tradeTime,

        symbol:security.symbol,

        isin:security.isin,

        side:row.side==="B"?"BUY":"SELL",

        exchange:row.exchange,

        quantity:Number(row.quantity),

        brokerage:Number(row.brokerage),

        price:Number(row.price),

        total:parseMoney(row.total)

    };

}

