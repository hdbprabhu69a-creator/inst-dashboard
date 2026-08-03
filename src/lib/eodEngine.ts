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

  const day =
    now.getDay();

  const daysFromMonday =
    day === 0
      ? 6
      : day - 1;


  const startOfCurrentWeek =
    new Date(now);

  startOfCurrentWeek.setDate(
    now.getDate() - daysFromMonday
  );

  startOfCurrentWeek.setHours(
    0,
    0,
    0,
    0
  );


  const weekClosed =
    (
      day === 6 ||
      day === 0 ||
      (
        day === 5 &&
        isMarketClosed()
      )
    );


  let startDate =
    new Date(startOfCurrentWeek);

  let endDate =
    new Date(startOfCurrentWeek);


  if (weekClosed) {

    endDate.setDate(
      endDate.getDate() + 7
    );

  } else {

    startDate.setDate(
      startDate.getDate() - 7
    );

  }


  return candles.filter(
    (c:any)=>{

      const d =
        new Date(c.date);

      return (
        d >= startDate &&
        d < endDate
      );

    }
  );

}

export function getPreviousTwoCompletedWeekCandles(
  candles:any[]
){

  const oneWeek=
    getPreviousCompletedWeekCandles(candles);

  if(!oneWeek.length)
    return [];

  const start=
    new Date(oneWeek[0].date);

  start.setDate(
    start.getDate()-7
  );

  const end=
    new Date(
      oneWeek[
        oneWeek.length-1
      ].date
    );

  return candles.filter((c:any)=>{

    const d=new Date(c.date);

    return d>=start && d<=end;

  });

}

function getCompletedMonths(
  candles:any[],
  months:number
){

  const now=new Date();

  let month=now.getMonth()-1;
  let year=now.getFullYear();

  if(month<0){

    month=11;

    year--;

  }

  const start=new Date(year,month-months+1,1);

  const end=new Date(year,month+1,1);

  return candles.filter((c:any)=>{

    const d=new Date(c.date);

    return d>=start && d<end;

  });

}

export function getPreviousThreeCompletedMonthCandles(
  candles:any[]
){

  return getCompletedMonths(
    candles,
    3
  );

}

export function getPreviousSixCompletedMonthCandles(
  candles:any[]
){

  return getCompletedMonths(
    candles,
    6
  );

}

export function getPreviousTwelveCompletedMonthCandles(
  candles:any[]
){

  return getCompletedMonths(
    candles,
    12
  );

}

