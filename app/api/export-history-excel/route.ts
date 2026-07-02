import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("PriceHistory");

  ws.columns = [
    {header:"Symbol",key:"symbol",width:18},
    {header:"InstrumentToken",key:"instrumentToken",width:18},
    {header:"Date",key:"date",width:15},
    {header:"Open",key:"open",width:12},
    {header:"High",key:"high",width:12},
    {header:"Low",key:"low",width:12},
    {header:"Close",key:"close",width:12},
    {header:"Volume",key:"volume",width:18}
  ];

  const universe = await getDocs(collection(db,"universe"));

  let total = 0;

  for (const stock of universe.docs) {

    const s = stock.data();

    const history = await getDocs(
      collection(
        db,
        "universe",
        stock.id,
        "history"
      )
    );

    const docs = history.docs.sort(
      (a,b)=>a.id.localeCompare(b.id)
    );

    for(const d of docs){

      const c=d.data();

      ws.addRow({

        symbol:s.symbol,

        instrumentToken:s.instrumentToken,

        date:d.id,

        open:c.open,

        high:c.high,

        low:c.low,

        close:c.close,

        volume:c.volume

      });

      total++;

    }

  }

  ws.views=[{state:"frozen",ySplit:1}];

  ws.autoFilter={
    from:"A1",
    to:"H1"
  };

  const buffer = Buffer.from(
    await wb.xlsx.writeBuffer()
  );

  return new NextResponse(buffer,{
    headers:{
      "Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":'attachment; filename="History_Verification.xlsx"',
      "X-Total-Rows":String(total)
    }
  });

}

