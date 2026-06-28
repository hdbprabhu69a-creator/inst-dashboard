export async function getMarketData(
  instrumentToken: number,
  timeframe: string
) {
  const response = await fetch(
    `/api/kite/history?token=${instrumentToken}&period=${timeframe}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load market data");
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error);
  }

  const candles = json.candles
    .map((c: any) => ({
      time: Math.floor(
        new Date(c.time).getTime() / 1000
      ),
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume ?? 0),
    }))
    .sort(
      (a: any, b: any) =>
        a.time - b.time
    );

  return candles;
}