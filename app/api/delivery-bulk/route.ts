import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

import csv from "csv-parser";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  buildDeliveryRecord,
} from "@/src/lib/deliveryEngine";

function convertDate(
  dateStr: string
) {

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
  ] =
    dateStr.split("-");

  return `${year}-${months[mon]}-${day}`;

}

export async function GET() {

  try {

    //
    // LOAD UNIVERSE
    //

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    const universeSymbols =
      universeSnapshot.docs.map(
        (doc) =>
          doc.data().symbol
      );

    //
    // FIND LATEST CSV
    //

    const deliveryFolder =
      path.join(
        process.cwd(),
        "data",
        "delivery"
      );

    const files =
      fs
        .readdirSync(
          deliveryFolder
        )
        .filter(
          (file) =>
            file.endsWith(
              ".csv"
            )
        )
        .sort();

    const latestFile =
      files[
        files.length - 1
      ];

    if (
      !latestFile
    ) {

      return NextResponse.json({

        success: false,

        error:
          "No delivery file found",

      });

    }

    //
    // READ FILE
    //

    const rows: any[] = [];

    await new Promise(
      (
        resolve,
        reject
      ) => {

        fs
          .createReadStream(
            path.join(
              deliveryFolder,
              latestFile
            )
          )

          .pipe(
            csv({
              mapHeaders:
                ({ header }) =>
                  header.trim(),
            })
          )

          .on(
            "data",
            (
              data
            ) => {

              rows.push(
                buildDeliveryRecord(
                  data
                )
              );

            }
          )

          .on(
            "end",
            resolve
          )

          .on(
            "error",
            reject
          );

      }
    );

    //
    // FILTER UNIVERSE
    //

    const filtered =
      rows.filter(
        (
          row
        ) =>
          universeSymbols.includes(
            row.symbol
          )
      );

    let written = 0;
    let skipped = 0;

    //
    // WRITE ONLY NEW RECORDS
    //

    for (
      const stock of filtered
    ) {

      const isoDate =
        convertDate(
          stock.date
        );

      const docId =
        `${stock.symbol}_${isoDate}`;

      const docRef =
        doc(
          db,
          "delivery_history",
          docId
        );

      const existing =
        await getDoc(
          docRef
        );

      if (
        existing.exists()
      ) {

        skipped++;

        continue;

      }

      await setDoc(

        docRef,

        {

          symbol:
            stock.symbol,

          date:
            isoDate,

          volume:
            stock.volume,

          deliveryQty:
            stock.deliveryQty,

          deliveryPct:
            stock.deliveryPct,

          createdAt:
            Date.now(),

        }

      );

      written++;

    }

    return NextResponse.json({

      success: true,

      file:
        latestFile,

      universeCount:
        universeSymbols.length,

      matchedStocks:
        filtered.length,

      written,

      skipped,

    });

  } catch (
    error: any
  ) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}