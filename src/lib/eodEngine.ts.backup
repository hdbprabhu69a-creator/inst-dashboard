export function isMarketClosed() {

  const now =
    new Date();

  const day =
    now.getDay();

  //
  // SATURDAY
  //

  if (day === 6) {

    return true;

  }

  //
  // SUNDAY
  //

  if (day === 0) {

    return true;

  }

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

export function isWeeklyClosed() {

  const now =
    new Date();

  const day =
    now.getDay();

  //
  // SATURDAY
  //

  if (day === 6) {

    return true;

  }

  //
  // SUNDAY
  //

  if (day === 0) {

    return true;

  }

  //
  // FRIDAY AFTER CLOSE
  //

  return (
    day === 5 &&
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

  return isMarketClosed()

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
    isWeeklyClosed();

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

  //
  // ALWAYS USE LAST
  // COMPLETED MONTH
  //

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
export function getPreviousCompletedWeekCandles(
  candles: any[]
) {

  const now =
    new Date();

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

  const startOfPreviousWeek =
    new Date(
      startOfCurrentWeek
    );

  startOfPreviousWeek.setDate(
    startOfPreviousWeek.getDate() - 7
  );

  return candles.filter(
    (c: any) => {

      const d =
        new Date(c.date);

      return (

        d >=
          startOfPreviousWeek &&

        d <
          startOfCurrentWeek

      );

    }
  );

}