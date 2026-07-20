export interface TradeRecord{

    contractNoteNo:string;

    tradeDate:string;

    settlementNo:string;

    settlementDate:string;

    clientId:string;

    clientName:string;

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

export interface OrderLedgerRow{

    orderNo:string;

    tradeDate:string;

    tradeTime:string;

    symbol:string;

    side:"BUY"|"SELL";

    quantity:number;

    averagePrice:number;

    tradeValue:number;

    brokerage:number;

}

export interface PositionState{

    symbol:string;

    holdingQty:number;

    averageCost:number;

    tradeAvg:number;

    holdingValue:number;

    realizedPnL:number;

    unrealizedPnL:number;

    totalProfit:number;

    totalLoss:number;

}

export interface PortfolioLedgerRow{

    tradeDate:string;

    symbol:string;

    action:"BUY"|"SELL";

    quantity:number;

    buyPrice:number|string;

    sellPrice:number|string;

    tradeValue:number;

    holdingQty:number;

    averageCost:number;

    tradeAvg:number;

    cmp:number;

    unrealizedPct:number;

    tradePnL:number;

    totalProfit:number;

    totalLoss:number;

    netRealized:number;

    unrealizedPnL:number;

    investedValue:number;

    holdingValue:number;

    remarks:string;

}





