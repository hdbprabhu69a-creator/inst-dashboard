import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET() {

  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const res =
    await fetch(
      `${base}/api/export-history`,
      { cache: "no-store" }
    );

  const json =
    await res.json();

  const workbook =
    new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet("History");

  sheet.columns = [
    { header:"Symbol", key:"symbol", width:18 },
    { header:"InstrumentToken", key:"instrumentToken", width:18 },
    { header:"Date", key:"date", width:15 },
    { header:"Open", key:"open", width:12 },
    { header:"High", key:"high", width:12 },
    { header:"Low", key:"low", width:12 },
    { header:"Close", key:"close", width:12 },
    { header:"Volume", key:"volume", width:18 }
  ];

  json.rows.forEach((r:any)=>sheet.addRow(r));

  sheet.views=[
    {
      state:"frozen",
      ySplit:1
    }
  ];

  sheet.autoFilter={
    from:"A1",
    to:"H1"
  };

  const buffer =
    await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer,{
    headers:{
      "Content-Type":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition":
      'attachment; filename="History_Verification.xlsx"'
    }
  });

}
