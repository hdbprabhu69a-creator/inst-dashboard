import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function POST(
  request: Request
) {

  try {

    const filters =
      await request.json();

    //
    // MARKET STRUCTURE
    //

    const marketSnapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    //
    // UNIVERSE
    //

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    //
    // SYMBOL -> SECTOR
    //

    const sectorMap =
      new Map<
        string,
        string
      >();

    universeSnapshot.docs.forEach(
      (doc) => {

        const data =
          doc.data();

        sectorMap.set(
          data.symbol,
          data.sector ||
          "UNKNOWN"
        );

      }
    );

    //
    // MERGE
    //

    const stocks =
      marketSnapshot.docs.map(
        (doc) => {

          const data =
            doc.data();

          return {

            id: doc.id,

            ...data,

            sector:
              sectorMap.get(
                data.symbol
              ) ||
              "UNKNOWN",

          };

        }
      );

    //
    // FILTER
    //

    const results =
      stocks.filter(
        (stock: any) => {

          const cmp =
            stock.cmp || 0;

          if (
            filters.aboveDailyPivot &&
            cmp <= stock.dailyPivot?.pivot
          ) {
            return false;
          }

          if (
            filters.aboveWeeklyPivot &&
            cmp <= stock.weeklyPivot?.pivot
          ) {
            return false;
          }

          if (
            filters.aboveMonthlyPivot &&
            cmp <= stock.monthlyPivot?.pivot
          ) {
            return false;
          }

          if (
            filters.aboveDailyVWAP &&
            cmp <= stock.dailyVWAP
          ) {
            return false;
          }

          if (
            filters.aboveWeeklyVWAP &&
            cmp <= stock.weeklyVWAP
          ) {
            return false;
          }

          if (
            filters.aboveMonthlyVWAP &&
            cmp <= stock.monthlyVWAP
          ) {
            return false;
          }

          if (
            filters.aboveDailyCPR &&
            cmp <= stock.dailyCPR?.tc
          ) {
            return false;
          }

          if (
            filters.aboveWeeklyCPR &&
            cmp <= stock.weeklyCPR?.tc
          ) {
            return false;
          }

          if (
            filters.aboveMonthlyCPR &&
            cmp <= stock.monthlyCPR?.tc
          ) {
            return false;
          }

          if (
            filters.near1WeekHigh
          ) {

            const high =
              stock.oneWeekSwing?.high;

            if (
              !high ||
              cmp <
              high * 0.95
            ) {
              return false;
            }

          }

          if (
            filters.near1MonthHigh
          ) {

            const high =
              stock.oneMonthSwing?.high;

            if (
              !high ||
              cmp <
              high * 0.95
            ) {
              return false;
            }

          }

          return true;

        }
      );

    return NextResponse.json({

      success: true,

      count:
        results.length,

      stocks:
        results,

    });

  } catch (
    error: any
  ) {

    console.error(
      error
    );

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}