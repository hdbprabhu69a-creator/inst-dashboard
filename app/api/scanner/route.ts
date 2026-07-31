import { NextResponse } from "next/server";
import { sendEmail } from "@/src/services/email";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  buyZoneScanner,
} from "@/src/lib/scanners/buyZoneScanner";

//
// GET
//

export async function GET() {

  try {

    const marketSnapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

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

    return NextResponse.json({

      success: true,

      count:
        stocks.length,

      stocks,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}

//
// POST
//

export async function POST(
  request: Request
) {
try {

    const filters =
      await request.json();

    const scanner =
      filters.scanner ||
      "ALL";
const marketSnapshot =
      await getDocs(
        collection(
          db,
          "marketStructure"
        )
      );

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

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

    const results = stocks.filter(
  (stock: any) => {
          const cmp =
            stock.cmp || 0;

          //
          // EXISTING FILTERS
          //

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
              cmp < high * 0.95
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
              cmp < high * 0.95
            ) {
              return false;
            }

          }

          //
          // CPR WIDTH < 0.5%
          //

          if (
            scanner === "CPR05"
          ) {

            const pivot =
              stock.dailyCPR?.pivot;

            const tc =
              stock.dailyCPR?.tc;

            const bc =
              stock.dailyCPR?.bc;

            if (
              !pivot ||
              !tc ||
              !bc
            ) {

              return false;

            }

            const width =

              (
                (
                  tc - bc
                ) /
                pivot
              ) * 100;

            if (
              width >= 0.5
            ) {

              return false;

            }

          }

          //
          // CPR WIDTH < 1%
          //

          if (
            scanner === "CPR10"
          ) {

            const pivot =
              stock.dailyCPR?.pivot;

            const tc =
              stock.dailyCPR?.tc;

            const bc =
              stock.dailyCPR?.bc;

            if (
              !pivot ||
              !tc ||
              !bc
            ) {

              return false;

            }

            const width =

              (
                (
                  tc - bc
                ) /
                pivot
              ) * 100;

            if (
              width >= 1
            ) {

              return false;

            }

          }
//
// ALIGNMENT SCANNER
//

if (
  scanner === "ALIGNMENT"
) {

  let score = 0;

  if (
    cmp >
    stock.dailyPivot?.pivot
  ) {
    score++;
  }

  if (
    cmp >
    stock.weeklyPivot?.pivot
  ) {
    score++;
  }

  if (
    cmp >
    stock.monthlyPivot?.pivot
  ) {
    score++;
  }

  if (
    cmp >
    stock.dailyVWAP
  ) {
    score++;
  }

  if (
    cmp >
    stock.weeklyVWAP
  ) {
    score++;
  }

  if (
    cmp >
    stock.monthlyVWAP
  ) {
    score++;
  }

  if (
    cmp >
    stock.dailyCPR?.tc
  ) {
    score++;
  }

  if (
    cmp >
    stock.weeklyCPR?.tc
  ) {
    score++;
  }

  if (
    cmp >
    stock.monthlyCPR?.tc
  ) {
    score++;
  }

  stock.alignmentScore =
    score;

  if (
    score < 8
  ) {

    return false;

  }

}
//
// BUY ZONE SCANNER
//

if (
  scanner ===
  "BUYZONE"
) {

  const result =
    buyZoneScanner(
      stock
    );

  stock.buyZoneScore =
    result.score;

  stock.buyZoneType =
    result.buyZoneType;

  stock.zoneLow =
    result.zoneLow;

  stock.zoneHigh =
    result.zoneHigh;

if (
  !result.inBuyZone
) {

  return false;

}
}
          return true;

        }
      );
if (
  scanner ===
  "BUYZONE"
) {

  results.sort(
    (
      a: any,
      b: any
    ) =>
      (
        b.buyZoneScore ||
        0
      ) -
      (
        a.buyZoneScore ||
        0
      )
  );

}
if (
  scanner === "BUYZONE" &&
  results.length > 0
) {

  const message =
    "ðŸ”¥ BUYZONE ALERT\n\n" +

    results
      .slice(0, 10)
      .map(
        (stock: any, index: number) =>
          `${index + 1}. ${stock.symbol}
Score: ${stock.buyZoneScore}
Type: ${stock.buyZoneType}`
      )
      .join("\n\n");

 try {
await sendEmail(
    "BUYZONE ALERT",
    message
  );
} catch (error) {

  console.error(
    "EMAIL ERROR:",
    error
  );

}
} 
else {

  results.sort(
    (
      a: any,
      b: any
    ) =>
      (
        b.alignmentScore ||
        0
      ) -
      (
        a.alignmentScore ||
        0
      )
  );

}    return NextResponse.json({

  success: true,

  count:
    results.length,

  stocks:
    results.map(
      (stock: any) => ({

        symbol:
          stock.symbol,

        sector:
          stock.sector,

        cmp:
          stock.cmp,

        buyZoneType:
          stock.buyZoneType,

        buyZoneScore:
          stock.buyZoneScore,

        zoneLow:
          stock.zoneLow,

        zoneHigh:
          stock.zoneHigh,

        alignmentScore:
          stock.alignmentScore,

      })
    ),

});

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}

