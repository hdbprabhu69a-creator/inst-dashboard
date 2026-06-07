import { NextResponse } from "next/server";

export async function GET() {

  const rows = [

    "Collection,Document,Action",

    "universe,TEST,DELETE",

    "marketStructure,TEST,DELETE",

  ];

  const csv =
    rows.join("\n");

  return new Response(
    csv,
    {
      headers: {
        "Content-Type":
          "text/csv",

        "Content-Disposition":
          'attachment; filename="cleanup-audit.csv"',
      },
    }
  );

}