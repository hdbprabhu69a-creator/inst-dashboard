import type {TradeRecord} from "./tradeTypes";

export interface ContractHeader{

    broker:string;

    clientId:string;

    clientName:string;

    tradeDate:string;

    settlementNo:string;

    segment:string;

}

export interface ContractCharges{

    brokerage:number;

    stt:number;

    exchangeTxnCharges:number;

    sebiCharges:number;

    stampDuty:number;

    gst:number;

    ipft:number;

    otherCharges:number;

    totalCharges:number;

}

export interface ContractSummary{

    grossBuy:number;

    grossSell:number;

    netAmount:number;

}

export interface ContractNote{

    header:ContractHeader;

    trades:TradeRecord[];

    charges:ContractCharges;

    summary:ContractSummary;

}
