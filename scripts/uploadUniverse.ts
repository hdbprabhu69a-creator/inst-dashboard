import "dotenv/config";

import fs from "fs";
import csv from "csv-parser";

import {
  collection,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

const results: any[] = [];

fs.createReadStream(
  "PIVOT_STOCK_LIST_UPGRADED.csv"
)
  .pipe(csv())

  .on("data", (data) => {
    results.push(data);
  })

  .on("end", async () => {
    try {

      console.log(
        `Loaded ${results.length} stocks from CSV`
      );

      const snapshot =
        await getDocs(
          collection(
            db,
            "universe"
          )
        );

      console.log(
        `Deleting ${snapshot.docs.length} existing universe docs...`
      );

      for (const docItem of snapshot.docs) {

        await deleteDoc(
          docItem.ref
        );

      }

      console.log(
        "Old universe deleted"
      );

      console.log(
        `Uploading ${results.length} stocks...`
      );

      for (const stock of results) {

        await addDoc(
          collection(
            db,
            "universe"
          ),
          {
            symbol:
              stock.symbol?.trim(),

            kiteSymbol:
              stock.kiteSymbol?.trim(),

            sector:
              stock.sector?.trim(),

            active: true,
          }
        );

        console.log(
          `Uploaded: ${stock.symbol}`
        );

      }

      console.log(
        "Upload Complete"
      );

    } catch (error) {

      console.error(
        "UPLOAD ERROR:",
        error
      );

    }
  });