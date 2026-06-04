import { NextResponse } from "next/server";

export async function GET() {

  const response =
    await fetch(
      "http://localhost:3000/api/market-structure"
    );

  const data =
    await response.json();

  const row = {

    symbol:
      data.symbol,

    cmp:
      data.cmp,

    dailyPivot:
      data.dailyPivot?.pivot,

    dailyR1:
      data.dailyPivot?.r1,

    dailyS1:
      data.dailyPivot?.s1,

    weeklyPivot:
      data.weeklyPivot?.pivot,

    weeklyR1:
      data.weeklyPivot?.r1,

    weeklyS1:
      data.weeklyPivot?.s1,

    monthlyPivot:
      data.monthlyPivot?.pivot,

    monthlyR1:
      data.monthlyPivot?.r1,

    monthlyS1:
      data.monthlyPivot?.s1,

    dailyCPR_TC:
      data.dailyCPR?.tc,

    dailyCPR_BC:
      data.dailyCPR?.bc,

    weeklyCPR_TC:
      data.weeklyCPR?.tc,

    weeklyCPR_BC:
      data.weeklyCPR?.bc,

    monthlyCPR_TC:
      data.monthlyCPR?.tc,

    monthlyCPR_BC:
      data.monthlyCPR?.bc,

    weeklyFib236:
      data.weeklyFib?.fib236,

    weeklyFib382:
      data.weeklyFib?.fib382,

    weeklyFib50:
      data.weeklyFib?.fib50,

    weeklyFib618:
      data.weeklyFib?.fib618,

    weeklyFib786:
      data.weeklyFib?.fib786,

    monthlyFib236:
      data.monthlyFib?.fib236,

    monthlyFib382:
      data.monthlyFib?.fib382,

    monthlyFib50:
      data.monthlyFib?.fib50,

    monthlyFib618:
      data.monthlyFib?.fib618,

    monthlyFib786:
      data.monthlyFib?.fib786,

    dailySwingHigh:
      data.dailySwing?.high,

    dailySwingLow:
      data.dailySwing?.low,

    dailySwingRange:
      data.dailySwing?.range,

    weeklySwingHigh:
      data.weeklySwing?.high,

    weeklySwingLow:
      data.weeklySwing?.low,

    weeklySwingRange:
      data.weeklySwing?.range,

    monthlySwingHigh:
      data.monthlySwing?.high,

    monthlySwingLow:
      data.monthlySwing?.low,

    monthlySwingRange:
      data.monthlySwing?.range,

  };

  return NextResponse.json({

    success: true,

    row,

  });

}