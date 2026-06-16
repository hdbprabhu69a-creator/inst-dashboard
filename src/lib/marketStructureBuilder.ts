import {
  KiteApiResponse,
  MarketStructure,
} from "@/types/market";

export function buildMarketStructure(
  data: KiteApiResponse | null
): MarketStructure | null {

  if (!data) {
    return null;
  }

  const quote =
    data.quote[
      `NSE:${data.symbol}`
    ];

  if (!quote) {
    return null;
  }

  return {

    symbol:
      data.symbol,

    instrumentToken:
      quote.instrument_token,

    cmp:
      quote.last_price,

    open:
      quote.ohlc.open,

    high:
      quote.ohlc.high,

    low:
      quote.ohlc.low,

    close:
      quote.ohlc.close,

    volume:
      quote.volume,

    average_price:
      quote.average_price,

    timestamp:
      quote.timestamp,

  } as any;

}