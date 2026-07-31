import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export async function getIndexHistory(
  symbol:string
){

  const indexSnap =
    await getDocs(
      query(
        collection(
          db,
          "universe_indices"
        ),
        where(
          "symbol",
          "==",
          symbol.toUpperCase()
        )
      )
    );


  if(indexSnap.empty)
    return [];


  const indexId =
    indexSnap.docs[0].id;


  const historySnap =
    await getDocs(
      query(
        collection(
          db,
          "universe_indices",
          indexId,
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
        new Date(d.date).getTime(),

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

