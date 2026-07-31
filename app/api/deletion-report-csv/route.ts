import { NextResponse } from "next/server";

export async function GET() {

  const rows = [

    "Collection,Target,Status",

    "universe,TEST,PENDING_DELETE",

    "marketStructure,TEST,PENDING_DELETE",

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
          'attachment; filename="deletion-report.csv"',
      },
    }
  );

}
