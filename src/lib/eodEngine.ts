export function isMarketClosed() {
  const now = new Date();
  const day = now.getDay();

  if (day === 6 || day === 0) {
    return true;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();

  return (
    hours > 15 ||
    (hours === 15 && minutes >= 30)
  );
}

export function isWeeklyClosed() {
  const now = new Date();
  const day = now.getDay();

  if (day === 6 || day === 0) {
    return true;
  }

  return day === 5 && isMarketClosed();
}

export function getCompletedDailyCandle(candles: any[]) {
  if (!candles?.length) return null;

  return isMarketClosed()
    ? candles[candles.length - 1]
    : candles[candles.length - 2];
}

function validCandles(candles: any[]) {
  return (candles ?? [])
    .filter((c: any) => c?.date)
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
}

function getDateWindow(
  candles: any[],
  days: number
) {
  const data = validCandles(candles);

  if (!data.length) return [];

  const latest = new Date(
    data[data.length - 1].date
  );

  const start = new Date(latest);

  start.setDate(
    start.getDate() - days
  );

  start.setHours(
    0,
    0,
    0,
    0
  );

  return data.filter((c: any) => {
    const d = new Date(c.date);

    return d >= start && d <= latest;
  });
}

export function getCompletedWeeklyCandles(
  candles: any[]
) {
  const data = validCandles(candles);

  if (!data.length) return [];

  const now = new Date();

  const day = now.getDay();

  const daysFromMonday =
    day === 0 ? 6 : day - 1;

  const startOfWeek = new Date(now);

  startOfWeek.setDate(
    now.getDate() - daysFromMonday
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0
  );

  const endOfWeek = new Date(
    startOfWeek
  );

  endOfWeek.setDate(
    endOfWeek.getDate() + 7
  );

  return data.filter((c: any) => {
    const d = new Date(c.date);

    return (
      d >= startOfWeek &&
      d < endOfWeek
    );
  });
}

export function getPreviousCompletedWeekCandles(
  candles: any[]
) {
  return getDateWindow(candles, 7);
}

export function getPreviousTwoCompletedWeekCandles(
  candles: any[]
) {
  return getDateWindow(candles, 14);
}

export function getCompletedMonthlyCandles(
  candles: any[]
) {
  return getDateWindow(candles, 30);
}

export function getPreviousThreeCompletedMonthCandles(
  candles: any[]
) {
  return getDateWindow(candles, 90);
}

export function getPreviousSixCompletedMonthCandles(
  candles: any[]
) {
  return getDateWindow(candles, 180);
}

export function getPreviousTwelveCompletedMonthCandles(
  candles: any[]
) {
  return getDateWindow(candles, 365);
}