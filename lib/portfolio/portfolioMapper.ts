import type {
  PortfolioHolding as KiteHolding,
  Position,
  Order,
} from "kiteconnect";

import type {
  PortfolioHolding,
  PortfolioPosition,
  PortfolioOrder,
} from "./portfolioTypes";

export function mapHoldings(
  holdings: KiteHolding[]
): PortfolioHolding[] {
  return holdings.map((h: any) => {
    const quantity =
      h.quantity > 0
        ? h.quantity
        : (h.mtf?.quantity ?? h.opening_quantity ?? 0);

    const investedValue =
      h.mtf?.value ??
      quantity * h.average_price;

    const marketValue =
      quantity * h.last_price;

    const totalPnL =
      marketValue - investedValue;

    return {
      symbol: h.tradingsymbol,

      mtfQty: h.mtf?.quantity ?? 0,
      cncQty: h.quantity ?? 0,

      quantity,

      averagePrice: h.average_price,
      lastPrice: h.last_price,

      investedValue,
      marketValue,

      unrealizedPnL: totalPnL,

      returnPercent:
        investedValue > 0
          ? (totalPnL / investedValue) * 100
          : 0,

      dayPnL: h.day_change ?? 0,

      dayChangePercent:
        h.day_change_percentage ?? 0,
    };
  });
}

export function mapPositions(
  positions: { net: Position[]; day: Position[] }
): PortfolioPosition[] {
  return positions.net.map((p) => ({
    symbol: p.tradingsymbol,
    exchange: p.exchange as "NSE" | "BSE",
    product: p.product as "CNC" | "MIS" | "NRML",
    quantity: p.quantity,
    averagePrice: p.average_price,
    lastPrice: p.last_price,
    marketValue: p.quantity * p.last_price,
    investedValue: p.quantity * p.average_price,
    unrealizedPnL: p.pnl,
    realizedPnL: 0,
    dayPnL: p.m2m,
    dayChangePercent: 0,
  }));
}

export function mapOrders(
  orders: Order[]
): PortfolioOrder[] {
  return orders.map((o) => ({
    orderId: o.order_id,
    symbol: o.tradingsymbol,
    side: o.transaction_type as "BUY" | "SELL",
    orderType: o.order_type as "MARKET" | "LIMIT" | "SL" | "SL-M",
    product: o.product as "CNC" | "MIS" | "NRML",
    quantity: o.quantity,
    price: o.price,
    status: o.status,
    exchange: o.exchange,
    timestamp: o.order_timestamp
      ? o.order_timestamp.toISOString()
      : "",
  }));
}
