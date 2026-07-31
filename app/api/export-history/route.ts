import { NextResponse } from "next/server";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  const universe = await getDocs(
    collection(db,"universe")
  );

  const rows:any[] = [];

  for(const stock of universe.docs){

    const s = stock.data();

    const history = await getDocs(
      collection(
        db,
        "universe",
        stock.id,
        "history"
      )
    );

    history.docs
      .sort(
        (a,b)=>
          a.id.localeCompare(b.id)
      )
      .forEach(doc=>{

        const c = doc.data();

        rows.push({

          symbol:
            s.symbol,

          instrumentToken:
            s.instrumentToken,

          date:
            doc.id,

          open:
            c.open,

          high:
            c.high,

          low:
            c.low,

          close:
            c.close,

          volume:
            c.volume

        });

      });

  }

  rows.sort(
    (a,b)=>
      a.symbol.localeCompare(b.symbol) ||
      a.date.localeCompare(b.date)
  );

  return NextResponse.json({

    success:true,

    total:rows.length,

    rows

  });

}

