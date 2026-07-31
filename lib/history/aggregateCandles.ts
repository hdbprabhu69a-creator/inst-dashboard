export type HistoryCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function mondayBucket(date: Date): number {

  const d = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));

  let day = d.getUTCDay();

  if (day === 0) day = 7;

  d.setUTCDate(d.getUTCDate() - (day - 1));

  d.setUTCHours(0,0,0,0);

  return Math.floor(d.getTime() / 1000);

}

function monthBucket(date: Date): number {

  return Math.floor(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    1,
    0,0,0,0
  ) / 1000);

}

export function aggregateCandles(
  candles: HistoryCandle[],
  interval: "D" | "W" | "M"
): HistoryCandle[] {

  if (interval === "D") {
    return candles;
  }

  const buckets = new Map<number, HistoryCandle>();

  for (const c of candles) {

    const d = new Date(c.time * 1000);

    const bucket =
      interval === "W"
        ? mondayBucket(d)
        : monthBucket(d);

    const existing = buckets.get(bucket);

    if (!existing) {

      buckets.set(bucket,{
        ...c,
        time: bucket,
      });

      continue;

    }

    existing.high = Math.max(existing.high,c.high);
    existing.low = Math.min(existing.low,c.low);
    existing.close = c.close;
    existing.volume += c.volume;

  }

  return [...buckets.values()]
    .sort((a,b)=>a.time-b.time);

}

