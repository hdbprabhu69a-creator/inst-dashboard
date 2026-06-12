import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

function formatDate(
  value: any
) {

  if (!value) {
    return "";
  }

  try {

    return value
      .toDate()
      .toLocaleDateString(
        "en-IN"
      );

  } catch {

    return "";
  }

}

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

          // DAILY AUDIT

          dailyOpen:
            data.dailyOHLC?.open,

          dailyHigh:
            data.dailyOHLC?.high,

          dailyLow:
            data.dailyOHLC?.low,

          dailyClose:
            data.dailyOHLC?.close,

          dailyVolume:
            data.dailyOHLC?.volume,

          dailyVWAP_Audit:
            data.dailyOHLC?.vwap,

          // WEEKLY AUDIT

          weeklyHigh:
            data.weeklyOHLC?.high,

          weeklyLow:
            data.weeklyOHLC?.low,

          weeklyClose:
            data.weeklyOHLC?.close,

          weeklyVolume:
            data.weeklyOHLC?.volume,

          weeklyVWAP_Audit:
            data.weeklyOHLC?.vwap,

          // MONTHLY AUDIT

          monthlyHigh:
            data.monthlyOHLC?.high,

          monthlyLow:
            data.monthlyOHLC?.low,

          monthlyClose:
            data.monthlyOHLC?.close,

          monthlyVolume:
            data.monthlyOHLC?.volume,

          monthlyVWAP_Audit:
            data.monthlyOHLC?.vwap,

          // SWING AUDIT

          oneWeekHigh:
            data.oneWeekSwing?.high,

          oneWeekLow:
            data.oneWeekSwing?.low,

          oneWeekRange:
            data.oneWeekSwing?.range,

          oneWeekHighDate:
            formatDate(
              data.oneWeekSwing?.highDate
            ),

          oneWeekLowDate:
            formatDate(
              data.oneWeekSwing?.lowDate
            ),

          twoWeekHigh:
            data.twoWeekSwing?.high,

          twoWeekLow:
            data.twoWeekSwing?.low,

          twoWeekRange:
            data.twoWeekSwing?.range,

          twoWeekHighDate:
            formatDate(
              data.twoWeekSwing?.highDate
            ),

          twoWeekLowDate:
            formatDate(
              data.twoWeekSwing?.lowDate
            ),

          oneMonthHigh:
            data.oneMonthSwing?.high,

          oneMonthLow:
            data.oneMonthSwing?.low,

          oneMonthRange:
            data.oneMonthSwing?.range,

          oneMonthHighDate:
            formatDate(
              data.oneMonthSwing?.highDate
            ),

          oneMonthLowDate:
            formatDate(
              data.oneMonthSwing?.lowDate
            ),

          threeMonthHigh:
            data.threeMonthSwing?.high,

          threeMonthLow:
            data.threeMonthSwing?.low,

          threeMonthRange:
            data.threeMonthSwing?.range,

          threeMonthHighDate:
            formatDate(
              data.threeMonthSwing?.highDate
            ),

          threeMonthLowDate:
            formatDate(
              data.threeMonthSwing?.lowDate
            ),

          sixMonthHigh:
            data.sixMonthSwing?.high,

          sixMonthLow:
            data.sixMonthSwing?.low,

          sixMonthRange:
            data.sixMonthSwing?.range,

          sixMonthHighDate:
            formatDate(
              data.sixMonthSwing?.highDate
            ),

          sixMonthLowDate:
            formatDate(
              data.sixMonthSwing?.lowDate
            ),

          oneYearHigh:
            data.oneYearSwing?.high,

          oneYearLow:
            data.oneYearSwing?.low,

          oneYearRange:
            data.oneYearSwing?.range,

          oneYearHighDate:
            formatDate(
              data.oneYearSwing?.highDate
            ),

          oneYearLowDate:
            formatDate(
              data.oneYearSwing?.lowDate
            ),

          // EXISTING DATA

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