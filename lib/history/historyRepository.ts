import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export async function getHistory(
  symbol:string
){

  const stockSnap =
    await getDocs(
      query(
        collection(db,"universe"),
        where(
          "symbol",
          "==",
          symbol.toUpperCase()
        )
      )
    );


  if(stockSnap.empty)
    return [];


  const stockId =
    stockSnap.docs[0].id;


  const historySnap =
    await getDocs(
      query(
        collection(
          db,
          "universe",
          stockId,
          "history"
        ),
        orderBy("date")
      )
    );


  return historySnap.docs.map(doc=>{

    const d:any =
      doc.data();


    return {

      time:
        d.date,

      open:Number(d.open),

      high:Number(d.high),

      low:Number(d.low),

      close:Number(d.close),

      volume:Number(
        d.volume ?? 0
      )

    };

  });

}
