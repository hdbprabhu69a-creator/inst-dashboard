import { NextResponse } from "next/server";
import axios from "axios";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {
  try {

    // Universe Stocks

    const snapshot = await getDocs(
      collection(db, "universe")
    );

    const stocks = snapshot.docs.map(
      (d) => ({
        id: d.id,
        ...d.data(),
      })
    );

    // Access Token

    const tokenDoc = await getDoc(
      doc(db, "settings", "kite")
    );

    const accessToken =
      tokenDoc.data()?.accessToken;

    if (!accessToken) {
      throw new Error(
        "No Access Token"
      );
    }

    // Instruments CSV

    const response = await axios.get(
      "https://api.kite.trade/instruments",
      {
        headers: {
          Authorization:
            `token ${process.env.KITE_API_KEY}:${accessToken}`,
          "X-Kite-Version": "3",
        },
      }
    );

    const csv =
      response.data.split("\n");

    let updated = 0;

    for (const stock of stocks) {

      const symbol =
        (stock as any).kiteSymbol;

      const row = csv.find(
        (line: string) =>
          line.includes(
            `,${symbol},`
          ) &&
          line.includes(",NSE")
      );

      if (!row) continue;

      const cols =
        row.split(",");

      const instrumentToken =
        Number(cols[0]);

      await updateDoc(
        doc(
          db,
          "universe",
          (stock as any).id
        ),
        {
          instrumentToken,
        }
      );

      updated++;

    }

    return NextResponse.json({
      success: true,
      updated,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: error.message,
    });

  }
}