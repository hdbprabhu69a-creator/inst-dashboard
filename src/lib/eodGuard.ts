export function canRunEOD() {

  return true;

}

export function isMarketClosed() {

  const now =
    new Date();

  const day =
    now.getDay();

  //
  // SATURDAY
  //

  if (
    day === 6
  ) {

    return true;

  }

  //
  // SUNDAY
  //

  if (
    day === 0
  ) {

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

  if (
    day === 6
  ) {

    return true;

  }

  if (
    day === 0
  ) {

    return true;

  }

  return (

    day === 5 &&

    isMarketClosed()

  );

}