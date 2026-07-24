import { INDEX_TOKEN_MAP } from "./indexTokenMap";
import { getHistoricalCandles } from "@/lib/kite/historical";

export async function getIndexHistory(
    symbol:string,
    lookback:number=126
){
    const token=INDEX_TOKEN_MAP[symbol.toUpperCase()];

    if(!token){
        throw new Error(`Unknown index: ${symbol}`);
    }

    const to=new Date();
    const from=new Date();
    from.setFullYear(from.getFullYear()-2);

    const raw=await getHistoricalCandles(
        token,
        from,
        to,
        "day"
    );

    return raw
        .map((c:any)=>({
            date:String(c.date).substring(0,10),
            open:Number(c.open),
            high:Number(c.high),
            low:Number(c.low),
            close:Number(c.close),
            volume:Number(c.volume??0),
        }))
        .slice(-lookback);
}
