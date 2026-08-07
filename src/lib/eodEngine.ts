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

export function getPreviousCompletedWeekCandles(
  candles:any[]
){
  if(!candles?.length) return [];

  return candles.slice(-5);
}

export function getPreviousTwoCompletedWeekCandles(
  candles:any[]
){
  if(!candles?.length) return [];

  return candles.slice(-10);
}

export function getCompletedMonthlyCandles(
  candles:any[]
){
  if(!candles?.length) return [];

  return candles.slice(-21);
}

export function getPreviousThreeCompletedMonthCandles(
  candles:any[]
){
  if(!candles?.length) return [];

  return candles.slice(-63);
}

export function getPreviousSixCompletedMonthCandles(
  candles:any[]
){
  if(!candles?.length) return [];

  return candles.slice(-126);
}

export function getPreviousTwelveCompletedMonthCandles(
  candles:any[]
){
  if(!candles?.length) return [];

  return candles.slice(-252);
}


