import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "marketStructure"
      )
    );

  const rows =
    snapshot.docs.map(
      (doc) => {

        const data =
          doc.data();

        return {

          symbol:
            data.symbol,

          cmp:
            data.cmp,

          dailyVWAP:
            data.dailyVWAP,

          weeklyVWAP:
            data.weeklyVWAP,

          monthlyVWAP:
            data.monthlyVWAP,

          avgVolumeDaily:
            data.avgVolumeDaily,

          avgVolumeWeekly:
            data.avgVolumeWeekly,

          avgVolumeMonthly:
            data.avgVolumeMonthly,

          dailyPVT:
            data.dailyPivot?.pivot,

          dailyCPR_TC:
            data.dailyCPR?.tc,

          dailyCPR_BC:
            data.dailyCPR?.bc,

          dailyR1:
            data.dailyPivot?.r1,

          dailyS1:
            data.dailyPivot?.s1,

          weeklyPVT:
            data.weeklyPivot?.pivot,

          weeklyCPR_TC:
            data.weeklyCPR?.tc,

          weeklyCPR_BC:
            data.weeklyCPR?.bc,

          weeklyR1:
            data.weeklyPivot?.r1,

          weeklyS1:
            data.weeklyPivot?.s1,

          monthlyPVT:
            data.monthlyPivot?.pivot,

          monthlyCPR_TC:
            data.monthlyCPR?.tc,

          monthlyCPR_BC:
            data.monthlyCPR?.bc,

          monthlyR1:
            data.monthlyPivot?.r1,

          monthlyS1:
            data.monthlyPivot?.s1,

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

          heatScore:
            data.heatScore,

          rsScore:
            data.rsScore,

          volumeScore:
            data.volumeScore,

          deliveryScore:
            data.deliveryScore,

          sectorScore:
            data.sectorScore,

          trendScore:
            data.trendScore,

        };

      }
    );

  return NextResponse.json({

    success: true,

    rows,

    total:
      rows.length,

  });

}