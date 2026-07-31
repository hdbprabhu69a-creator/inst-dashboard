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

      // ðŸ”¥ FIX 1: SAFE TIME NORMALIZATION
      let time: number;

      if (typeof c.time === "string") {
        time = Math.floor(new Date(c.time).getTime() / 1000);
      } else {
        time = c.time;
      }

      // ðŸ”¥ FIX 2: detect milliseconds â†’ convert to seconds
      if (time > 100000000000) {
        time = Math.floor(time / 1000);
      }

      // ðŸ”¥ FIX 3: invalid time guard
      if (!Number.isFinite(time) || time <= 0) return null;

      return {
        time,
        open,
        high,
        low,
        close,
        volume: Number(c.volume ?? 0),
      };
    })

    // ðŸ”¥ FIX 4: remove nulls safely
    .filter((c) => c !== null)

    // ðŸ”¥ FIX 5: strict sorting (TV order correctness)
    .sort((a, b) => a.time - b.time);
}
