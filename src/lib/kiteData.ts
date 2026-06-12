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

  const to =
    new Date();

  const from =
    new Date();

  from.setDate(
    from.getDate() - 400
  );

  return await kite.getHistoricalData(
    instrumentToken,
    "day",
    from,
    to
  );

}