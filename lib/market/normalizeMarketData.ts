export type RawCandle = {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export function normalizeMarketData(data: RawCandle[]) {
  if (!data || data.length === 0) return [];

  return data
    .map((c) => {
      const open = Number(c.open);
      const high = Number(c.high);
      const low = Number(c.low);
      const close = Number(c.close);

      return {
        time:
          typeof c.time === "string"
            ? new Date(c.time).getTime() / 1000
            : c.time, // KEEP REAL TIME

        open,
        high,
        low,
        close,
        volume: Number(c.volume ?? 0),
      };
    })
    .filter(
      (c) =>
        !isNaN(c.open) &&
        !isNaN(c.high) &&
        !isNaN(c.low) &&
        !isNaN(c.close)
    )
    .sort((a, b) => a.time - b.time);
}