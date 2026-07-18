export interface PortfolioSummary{
  netWorth:number;
  dayPnL:number;
  totalPnL:number;
  unrealizedPnL:number;
  realizedPnL:number;
  cash:number;
  buyingPower:number;
  investedValue:number;
  marketValue:number;
}

export interface PortfolioPosition{
  symbol:string;
  exchange:"NSE"|"BSE";
  product:"CNC"|"MIS"|"NRML";
  quantity:number;
  averagePrice:number;
  lastPrice:number;
  marketValue:number;
  investedValue:number;
  unrealizedPnL:number;
  realizedPnL:number;
  dayPnL:number;
  dayChangePercent:number;
}

export interface PortfolioHolding{
  symbol:string;
  quantity:number;
  averagePrice:number;
  investedValue:number;
}

export interface PortfolioOrder{
  orderId:string;
  symbol:string;
  side:"BUY"|"SELL";
  orderType:"MARKET"|"LIMIT"|"SL"|"SL-M";
  product:"CNC"|"MIS"|"NRML";
  quantity:number;
  price:number;
  status:string;
  exchange:string;
  timestamp:string;
}

export interface PortfolioSnapshot{
  summary:PortfolioSummary;
  holdings:PortfolioHolding[];
  positions:PortfolioPosition[];
  openOrders:PortfolioOrder[];
  completedOrders:PortfolioOrder[];
  lastUpdated:string;
}
