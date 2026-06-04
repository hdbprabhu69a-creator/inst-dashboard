import { NextResponse } from "next/server";

import {
  convertToCSV,
} from "@/src/lib/csv";

export async function GET() {

  const response =
    await fetch(
      "http://localhost:3000/api/market-structure-csv"
    );

  const result =
    await response.json();

  const csv =
    convertToCSV([
      result.row
    ]);

  return new Response(
    csv,
    {
      headers: {
        "Content-Type":
          "text/csv",

        "Content-Disposition":
          'attachment; filename="VOLTAS_AUDIT.csv"',
      },
    }
  );

}