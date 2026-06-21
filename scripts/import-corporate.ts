import dotenv from "dotenv";
import fs from "fs";
import csv from "csv-parser";

dotenv.config({
  path: ".env.local",
});

const { adminDb } = require("../lib/firebase-admin");
const { STOCK_UNIVERSE } = require("../lib/universe");

async function importCorporate() {
  const filePath =
    "C:/Users/User/Downloads/CF-AN-equities-13-06-2026-to-20-06-2026.csv";

  const rows: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => resolve())
      .on("error", reject);
  });

  console.log(
    `CSV Rows Loaded: ${rows.length}`
  );

  const filteredRows = rows.filter(
    (row) => {
      const symbolKey =
        Object.keys(row).find((k) =>
          k.includes("SYMBOL")
        );

      const symbol = symbolKey
        ? String(
            row[symbolKey]
          ).trim()
        : "";

      return STOCK_UNIVERSE.includes(
        symbol
      );
    }
  );

  console.log(
    `Universe Matches: ${filteredRows.length}`
  );

  let inserted = 0;
  let skipped = 0;

  for (const row of filteredRows) {
    const symbolKey =
      Object.keys(row).find((k) =>
        k.includes("SYMBOL")
      );

    const symbol = symbolKey
      ? String(
          row[symbolKey]
        ).trim()
      : "";

    const summary =
      row["DETAILS"] || "";

    const existing = await adminDb
      .collection(
        "corporate_announcements"
      )
      .where("stock", "==", symbol)
      .where("summary", "==", summary)
      .limit(1)
      .get();

    if (!existing.empty) {
      skipped++;
      continue;
    }

    await adminDb
      .collection(
        "corporate_announcements"
      )
      .add({
        stock: symbol,
        type:
          row["SUBJECT"] ||
          "Corporate",

        summary,

        source: "NSE",

        date:
          row[
            "BROADCAST DATE/TIME"
          ] || "",

        time: "",

        attachment:
          row["ATTACHMENT"] ||
          "",

        createdAt: Date.now(),
      });

    inserted++;

    console.log(
      `Inserted ${inserted}: ${symbol}`
    );
  }

  console.log(
    "===================="
  );

  console.log(
    `Inserted: ${inserted}`
  );

  console.log(
    `Skipped: ${skipped}`
  );
}

importCorporate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });