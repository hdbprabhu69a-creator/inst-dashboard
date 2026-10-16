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
  const data = validCandles(candles);

  if (!data.length) return [];

  const indiaParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (type: string) =>
    indiaParts.find((item) => item.type === type)?.value ?? "";

  const todayKey =
    `${part("year")}-${part("month")}-${part("day")}`;

  const currentWeekStart =
    new Date(`${todayKey}T00:00:00.000Z`);

  const day = currentWeekStart.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  currentWeekStart.setUTCDate(
    currentWeekStart.getUTCDate() - daysFromMonday
  );

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setUTCDate(
    previousWeekStart.getUTCDate() - 7
  );

  const formatDateKey = (date: Date) =>
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

  const startKey = formatDateKey(previousWeekStart);
  const endKey = formatDateKey(currentWeekStart);

  return data.filter((c: any) => {
    const rawDate = String(c.date ?? "");
    const match = rawDate.match(/^(\d{4}-\d{2}-\d{2})/);

    let dateKey: string;

    if (match) {
      dateKey = match[1];
    } else {
      const parsed = new Date(c.date);

      if (Number.isNaN(parsed.getTime())) return false;

      dateKey = formatDateKey(parsed);
    }

    return dateKey >= startKey && dateKey < endKey;
  });
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