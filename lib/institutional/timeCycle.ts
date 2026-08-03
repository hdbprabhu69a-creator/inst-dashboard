export interface TimeCycle {
  period: string;
  returnPct: number;
  interpretation: string;
  low: number;
  high: number;
}

export interface TimeCycleResult {
  cycle15?: TimeCycle;
  cycle45?: TimeCycle;
  cycle63?: TimeCycle;
  cycle90?: TimeCycle;
  cycle180?: TimeCycle;
  cycle252?: TimeCycle;
}

const CYCLES = [15, 45, 63, 90, 180, 252] as const;

export function buildTimeCycles(history: any[]): TimeCycleResult {
  return {
    cycle15: buildCycle(history, 15),
    cycle45: buildCycle(history, 45),
    cycle63: buildCycle(history, 63),
    cycle90: buildCycle(history, 90),
    cycle180: buildCycle(history, 180),
    cycle252: buildCycle(history, 252),
  };
}

function buildCycle(
  history: any[],
  sessions: number
): TimeCycle | undefined {

  if (history.length < sessions) return;

  const candles = history.slice(-sessions);

  const first = candles[0];
  const last = candles[candles.length - 1];

  const high = Math.max(...candles.map(c => c.high));
  const low = Math.min(...candles.map(c => c.low));

  const returnPct =
    Number(
      (
        ((last.close - first.close) / first.close) *
        100
      ).toFixed(2)
    );

  return {
    period:
      `${formatDate(first.time)} → ${formatDate(last.time)}`,
    returnPct,
    interpretation: getInterpretation(returnPct),
    low,
    high,
  };
}

function getInterpretation(
  returnPct: number
): string {

  if (returnPct >= 20)
    return "Primary";

  if (returnPct >= 8)
    return "Uptrend";

  if (returnPct >= 2)
    return "Expansion";

  if (returnPct >= -2)
    return "Consolidation";

  if (returnPct >= -8)
    return "Accumulation";

  return "Distribution";
}

function formatDate(
  value: any
): string {

  const d =
    value instanceof Date
      ? value
      : value.toDate
      ? value.toDate()
      : new Date(value);

  return d.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}