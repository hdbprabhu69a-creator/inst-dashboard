import type {TradeRecord} from "./tradeTypes";

export interface ContractHeader{

    contractNoteNo:string;

    tradeDate:string;

    settlementNo:string;

    settlementDate:string;

    clientId:string;

    clientName:string;

}

export interface TradeSummary{

    symbol:string;

    isin:string;

    buyQty:number;

    sellQty:number;

    buyValue:number;

    sellValue:number;

    netQty:number;

    netObligation:number;

    averagePrice:number;

}

export interface ContractCharges{

    brokerage:number;

    exchangeCharges:number;

    igst:number;

    stt:number;

    sebiFees:number;

    stampDuty:number;

    netAmount:number;

}

export interface ContractNote{

    header:ContractHeader;

    summary:TradeSummary;

    charges:ContractCharges;

    trades:TradeRecord[];

}

