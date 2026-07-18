export interface TradeRecord{

    orderNo:string;

    orderTime:string;

    tradeNo:string;

    tradeTime:string;

    symbol:string;

    isin:string;

    side:"BUY"|"SELL";

    exchange:string;

    quantity:number;

    brokerage:number;

    price:number;

    total:number;

}
