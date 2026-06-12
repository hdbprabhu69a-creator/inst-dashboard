export function isMarketClosed() {

  const now =
    new Date();

  const hours =
    now.getHours();

  const minutes =
    now.getMinutes();

  return (
    hours > 15 ||
    (
      hours === 15 &&
      minutes >= 30
    )
  );

}

export function isFridayAfterClose() {

  const now =
    new Date();

  return (
    now.getDay() === 5 &&
    isMarketClosed()
  );

}

export function getCompletedDailyCandle(
  candles: any[]
) {

  if (
    !candles ||
    candles.length === 0
  ) {
    return null;
  }

  const marketClosed =
    isMarketClosed();

  return marketClosed
    ? candles[
        candles.length - 1
      ]
    : candles[
        candles.length - 2
      ];

}

export function getCompletedWeeklyCandles(
  candles: any[]
) {

  const now =
    new Date();

  const useCurrentWeek =
    isFridayAfterClose();

  const daysFromMonday =
    now.getDay() === 0
      ? 6
      : now.getDay() - 1;

  const startOfCurrentWeek =
    new Date(now);

  startOfCurrentWeek.setDate(
    now.getDate() -
    daysFromMonday
  );

  startOfCurrentWeek.setHours(
    0,
    0,
    0,
    0
  );

  const startDate =
    new Date(
      startOfCurrentWeek
    );

  const endDate =
    new Date(
      startOfCurrentWeek
    );

  if (
    useCurrentWeek
  ) {

    endDate.setDate(
      endDate.getDate() + 7
    );

  } else {

    startDate.setDate(
      startDate.getDate() - 7
    );

  }

  return candles.filter(
    (c: any) => {

      const d =
        new Date(c.date);

      return (
        d >= startDate &&
        d < endDate
      );

    }
  );

}

export function getCompletedMonthlyCandles(
  candles: any[]
) {

  const now =
    new Date();

  let month =
    now.getMonth() - 1;

  let year =
    now.getFullYear();

  if (
    month < 0
  ) {

    month = 11;
    year--;

  }

  return candles.filter(
    (c: any) => {

      const d =
        new Date(c.date);

      return (
        d.getMonth() ===
          month &&
        d.getFullYear() ===
          year
      );

    }
  );

}