import "dotenv/config";

import fs from "fs";
import path from "path";
import csv from "csv-parser";

import {
  doc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../lib/firebase";

function parseNumber(value: any): number {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  return Number(
    String(value)
      .replace(/,/g, "")
      .trim()
  );

}

function toISODate(
  date: string
): string {

  const months: Record<
    string,
    string
  > = {

    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",

  };

  const [
    day,
    mon,
    year,
  ] = date.split("-");

  return `${year}-${months[mon]}-${day.padStart(2, "0")}`;

}

const HISTORY_FOLDER =
  "./data/history";

async function importFile(
  filePath: string
) {

  const symbol =
    path.basename(filePath)
      .replace(/\.csv$/i, "")
      .toUpperCase();

  console.log("");
  console.log(
    "=================================="
  );
  console.log(symbol);
  console.log(
    "=================================="
  );

  try {

    const rows:
      Record<
        string,
        string
      >[] = [];

    await new Promise<void>((resolve, reject) => {

        fs.createReadStream(
          filePath
        )

          .pipe(csv())

.on(
  "data",
  row => {

    rows.push(row);

  }
)

.on(
  "end",
  () => resolve()
)

.on(
  "error",
  reject
);  
});
    console.log(
      `Rows : ${rows.length}`
    );

    let batch =
      writeBatch(db);

    let count = 0;

    const importedDates =
      new Set<string>();

    for (
      const row of rows
    ) {

      const keys =
  Object.keys(row);

const rawDate =
  row[keys[0]];

console.log(
  keys[0],
  rawDate
);
console.log(
  "DATE:",
  rawDate,
  "OPEN:",
  row.OPEN
);

      if (!rawDate)
        continue;

      const date =
        toISODate(rawDate);

      if (
        importedDates.has(
          date
        )
      ) {
        continue;
      }

      importedDates.add(
        date
      );

      if (
        Number.isNaN(
          parseNumber(
            row.OPEN
          )
        ) ||

        Number.isNaN(
          parseNumber(
            row.HIGH
          )
        ) ||

        Number.isNaN(
          parseNumber(
            row.LOW
          )
        ) ||

        Number.isNaN(
          parseNumber(
            row.CLOSE
          )
        )

      ) {

        console.log(
          `Skipping ${rawDate}`
        );

        continue;

      }

      const ref =
        doc(
          db,
          "marketHistory",
          symbol,
          "daily",
          date
        );

      batch.set(
        ref,
        {
                    symbol,

          date,

          rawDate,

          sourceFile:
            path.basename(
              filePath
            ),

          year:
            Number(
              date.substring(
                0,
                4
              )
            ),

          month:
            Number(
              date.substring(
                5,
                7
              )
            ),

          day:
            Number(
              date.substring(
                8,
                10
              )
            ),

          timestamp:
            Date.parse(
              date
            ),

          series:
            row.SERIES,

          open:
            parseNumber(
              row.OPEN
            ),

          high:
            parseNumber(
              row.HIGH
            ),

          low:
            parseNumber(
              row.LOW
            ),

          prevClose:
            parseNumber(
              row["PREV. CLOSE"]
            ),

          ltp:
            parseNumber(
              row.LTP
            ),

          close:
            parseNumber(
              row.CLOSE
            ),

          vwap:
            parseNumber(
              row.VWAP
            ),

          high52Week:
            parseNumber(
              row["52W H"]
            ),

          low52Week:
            parseNumber(
              row["52W L"]
            ),

          volume:
            parseNumber(
              row.VOLUME
            ),

          value:
            parseNumber(
              row.VALUE
            ),

          trades:
            parseNumber(
              row[
                "NO. OF  TRADES"
              ]
            ),

          updatedAt:
            new Date()
              .toISOString(),

        }
      );

      count++;

      if (
        count % 450 === 0
      ) {

        await batch.commit();

        console.log(
          `Imported ${count}`
        );

        batch =
          writeBatch(db);

      }

    }

    if (
      count % 450 !== 0
    ) {

      await batch.commit();

    }

    console.log("");

    console.log(
      `${symbol} Imported : ${count}`
    );

  } catch (err) {

    console.error(
      `FAILED : ${symbol}`,
      err
    );

  }

}

async function main() {

  const files =
    fs.readdirSync(
      HISTORY_FOLDER
    )
    .filter(
      file =>
        file
          .toLowerCase()
          .endsWith(".csv")
    );

  console.log(
    `CSV Files : ${files.length}`
  );

  for (
    const file of files
  ) {

    await importFile(

      path.join(
        HISTORY_FOLDER,
        file
      )

    );

  }

  console.log("");

  console.log(
    "ALL IMPORTS COMPLETED"
  );

}

main();