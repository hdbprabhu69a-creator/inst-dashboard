import type { TradeRecord } from "@/lib/trade-ledger/types";

export function mapTradeRecord(
  trade: TradeRecord
) {

  return {

    tradeDate: trade.tradeDate,
    tradeTime: trade.tradeTime ?? null,

    exchange: trade.exchange,
    segment: trade.segment,

    symbol: trade.symbol,
    series: trade.series ?? null,

    side: trade.side,

    quantity: trade.quantity,
    price: trade.price,
    grossValue: trade.grossValue,

    orderNumber: trade.orderNumber ?? null,
    tradeNumber: trade.tradeNumber ?? null,

  };

}
