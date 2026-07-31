export interface TradeRecord {

  tradeDate:string;
  tradeTime?:string;

  exchange:string;
  segment:string;

  symbol:string;
  series?:string;

  side:"BUY"|"SELL";

  quantity:number;
  price:number;
  grossValue:number;

  orderNumber?:string;
  tradeNumber?:string;

}

export interface Charges {

  brokerage:number;

  stt:number;
  exchangeCharges:number;
  sebiCharges:number;
  gst:number;
  stampDuty:number;

  clearingCharges?:number;
  ipftCharges?:number;
  otherCharges?:number;

  totalCharges:number;

}

export interface SettlementSummary {

  settlementNumber?:string;
  settlementDate?:string;

  grossBuyValue:number;
  grossSellValue:number;

  turnover:number;
  netAmount:number;

}

export interface EquitySummary {

  isin:string;

  symbol:string;

  buyQuantity:number;
  buyAveragePrice:number;
  buyValue:number;

  sellQuantity:number;
  sellAveragePrice:number;
  sellValue:number;

  netQuantity:number;
  netObligation:number;

}

export interface InstrumentInfo {

  instrumentType:"EQ"|"FUT"|"OPT"|"CDS"|"MCX";

  expiry?:string;
  strikePrice?:number;
  optionType?:"CE"|"PE";

}

export interface ContractNote {

  trades:TradeRecord[];

  charges:Charges;

  settlement:SettlementSummary;

  equity:EquitySummary[];

  instruments:InstrumentInfo[];

}


