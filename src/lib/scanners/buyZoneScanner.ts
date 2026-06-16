export function buyZoneScanner(
  stock: any
) {

  let score = 0;

  let buyZoneType =
    "NONE";

  let zoneLow = 0;

  let zoneHigh = 0;

  let inBuyZone =
    false;

  //
  // TREND FILTER
  //

  const bullishTrend =

    stock.cmp >
      (stock.dailyPivot?.pivot || 0) &&

    stock.cmp >
      (stock.weeklyPivot?.pivot || 0) &&

    stock.cmp >
      (stock.monthlyPivot?.pivot || 0) &&

    stock.cmp >
      (stock.dailyVWAP || 0) &&

    stock.cmp >
      (stock.weeklyVWAP || 0);

  if (
    bullishTrend
  ) {

    score += 20;

  }

  //
  // CPR SUPPORT
  //

  const cprDistance =

    stock.weeklyCPR?.bc

      ? (
          Math.abs(
            stock.cmp -
            stock.weeklyCPR.bc
          ) /
          stock.cmp
        ) * 100

      : 999;

  if (
    cprDistance <= 0.5
  ) {

    score += 20;

    inBuyZone = true;

    buyZoneType =
      "CPR_SUPPORT";

    zoneLow =
  Math.min(
    stock.weeklyCPR?.bc || 0,
    stock.weeklyCPR?.tc || 0
  );

zoneHigh =
  Math.max(
    stock.weeklyCPR?.bc || 0,
    stock.weeklyCPR?.tc || 0
  );
  }

  //
  // FIB PULLBACK
  //

  const fibDistance =

    stock.oneMonthFib?.fib382

      ? (
          Math.abs(
            stock.cmp -
            stock.oneMonthFib.fib382
          ) /
          stock.cmp
        ) * 100

      : 999;

  if (
    fibDistance <= 1
  ) {

    score += 15;

    inBuyZone = true;

    if (
      buyZoneType ===
      "NONE"
    ) {

      buyZoneType =
        "FIB_PULLBACK";

      zoneLow =
        stock.oneMonthFib?.fib382 || 0;

      zoneHigh =
        stock.oneMonthFib?.fib236 || 0;

    }

  }

  //
  // PANIC ABSORPTION
  //

  const correctionPct =

    stock.oneMonthSwing?.high

      ? (
          (
            stock.oneMonthSwing.high -
            stock.cmp
          ) /
          stock.oneMonthSwing.high
        ) * 100

      : 0;

  if (

    correctionPct >= 5 &&

    correctionPct <= 15 &&

    stock.cmp >
      (
        stock.oneMonthFib?.fib50 || 0
      )

  ) {

    score += 25;

    inBuyZone = true;

    buyZoneType =
      "PANIC_ABSORPTION";

    zoneLow =
      stock.oneMonthFib?.fib618 || 0;

    zoneHigh =
      stock.oneMonthFib?.fib382 || 0;

  }

  //
  // RECOVERY
  //

  if (

    stock.cmp >
      (
        stock.oneWeekFib?.fib382 || 0
      ) &&

    stock.cmp >
      (
        stock.oneWeekFib?.fib236 || 0
      )

  ) {

    score += 15;

  }

  //
  // DELIVERY
  //

  if (

    (stock.deliveryPctWeekly || 0) >

    (stock.deliveryPctMonthly || 0)

  ) {

    score += 10;

  }

  //
  // VOLUME
  //

  if (

    (stock.totalVolumeDaily || 0) >

    (stock.avgVolumeDaily || 0)

  ) {

    score += 10;

  }

  return {

    symbol:
      stock.symbol,

    score,

    buyZoneType,

    zoneLow,

    zoneHigh,

    inBuyZone,

  };

}