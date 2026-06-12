import { KiteApiResponse } from "@/types/market";

export function getQuoteData(
  data: KiteApiResponse | null
) {

  if (!data) {
    return null;
  }

  const exchangeSymbol =
    `NSE:${data.symbol}`;

  return (
    data.quote[
      exchangeSymbol
    ] || null
  );

}

export function getInstrumentToken(
  data: KiteApiResponse | null
) {

  const quote =
    getQuoteData(data);

  return quote
    ?.instrument_token ?? null;

}

export function getLastPrice(
  data: KiteApiResponse | null
) {

  const quote =
    getQuoteData(data);

  return quote
    ?.last_price ?? null;

}

export function getVolume(
  data: KiteApiResponse | null
) {

  const quote =
    getQuoteData(data);

  return quote
    ?.volume ?? null;

}