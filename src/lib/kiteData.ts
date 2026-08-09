import fs from "fs";
import path from "path";
import csv from "csv-parser";

export async function loadInstrumentMap() {
  const instrumentMap =
    new Map<string, number>();

  return new Promise<Map<string, number>>(
    (resolve, reject) => {
      fs.createReadStream(
        path.join(
          process.cwd(),
          "data",
          "zerodha-instruments.csv"
        )
      )
        .pipe(csv())

        .on("data", (row) => {
          if (
            row.exchange === "NSE"
          ) {
            instrumentMap.set(
              row.tradingsymbol,
              Number(
                row.instrument_token
              )
            );
          }
        })

        .on(
          "end",
          () => {
            console.log(
              "INSTRUMENTS LOADED:",
              instrumentMap.size
            );

            resolve(
              instrumentMap
            );
          }
        )

        .on(
          "error",
          reject
        );
    }
  );
}

export async function getDailyCandles(
  kite: any,
  instrumentToken: number
) {
  const now = new Date();

  /*
   * Current India time
   */
  const indiaNow =
    new Date(
      now.toLocaleString(
        "en-US",
        {
          timeZone:
            "Asia/Kolkata",
        }
      )
    );

  let targetDate =
    new Date(indiaNow);

  /*
   * Saturday
   * Use Friday
   */
  if (
    targetDate.getDay() === 6
  ) {
    targetDate.setDate(
      targetDate.getDate() - 1
    );
  }

  /*
   * Sunday
   * Use Friday
   */
  if (
    targetDate.getDay() === 0
  ) {
    targetDate.setDate(
      targetDate.getDate() - 2
    );
  }

  /*
   * Weekday before 3:30 PM
   * Current day's candle is
   * not completed yet.
   */
  if (
    targetDate.getDay() >= 1 &&
    targetDate.getDay() <= 5 &&
    (
      targetDate.getHours() < 15 ||
      (
        targetDate.getHours() === 15 &&
        targetDate.getMinutes() < 30
      )
    )
  ) {
    targetDate.setDate(
      targetDate.getDate() - 1
    );

    /*
     * Monday -> Friday
     */
    if (
      targetDate.getDay() === 0
    ) {
      targetDate.setDate(
        targetDate.getDate() - 2
      );
    }

    /*
     * Saturday -> Friday
     */
    if (
      targetDate.getDay() === 6
    ) {
      targetDate.setDate(
        targetDate.getDate() - 1
      );
    }
  }

  /*
   * Build explicit IST
   * end-of-day timestamp.
   */
  const yyyy =
    targetDate.getFullYear();

  const mm =
    String(
      targetDate.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      targetDate.getDate()
    ).padStart(2, "0");

  const to =
    new Date(
      `${yyyy}-${mm}-${dd}T23:59:59+05:30`
    );

  /*
   * Get 400 days of history
   */
  const from =
    new Date(to);

  from.setDate(
    from.getDate() - 400
  );

  console.log(
    "[DAILY CANDLES]",
    "TOKEN:",
    instrumentToken
  );

  console.log(
    "[DAILY CANDLES]",
    "FROM:",
    from.toISOString()
  );

  console.log(
    "[DAILY CANDLES]",
    "TO:",
    to.toISOString()
  );

  const candles =
    await kite.getHistoricalData(
      instrumentToken,
      "day",
      from,
      to
    );

  console.log(
    "[DAILY CANDLES RESULT]",
    "COUNT:",
    candles?.length ?? 0
  );

  console.log(
    "[DAILY CANDLES RESULT]",
    "FIRST:",
    candles?.[0]?.date
  );

  console.log(
    "[DAILY CANDLES RESULT]",
    "LAST:",
    candles?.[
      candles.length - 1
    ]?.date
  );

  return candles;
}