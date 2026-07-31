import { DeliveryEngine } from "@/lib/delivery-analysis/DeliveryEngine";
import { adminDb } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";

export async function getDeliveryAnalysis(symbol:string){

  const deliverySnap=await adminDb
    .collection("delivery_history")
    .where("symbol","==",symbol)
    .get();

  if(deliverySnap.empty){
    return null;
  }

  const deliveryRecords=deliverySnap.docs
    .map(d=>d.data())
    .sort(
      (a:any,b:any)=>
        new Date(a.date).getTime()-
        new Date(b.date).getTime()
    );

  const stockSnap=await getDocs(
    query(
      collection(db,"universe"),
      where("symbol","==",symbol)
    )
  );

  if(stockSnap.empty){
    return null;
  }

  const stockId=stockSnap.docs[0].id;

  const historySnap=await getDocs(
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

  const historyMap=new Map(
    historySnap.docs.map(doc=>{
      const h:any=doc.data();
      return[String(h.date),h];
    })
  );

  const records=deliveryRecords
    .map((d:any)=>{

      const h=historyMap.get(String(d.date));

      if(!h) return null;

      return{

        symbol:d.symbol,

        date:d.date,

        open:Number(h.open),

        high:Number(h.high),

        low:Number(h.low),

        close:Number(h.close),

        volume:Number(d.volume),

        deliveryQty:Number(d.deliveryQty),

        deliveryPercent:Number(d.deliveryPct)

      };

    })
    .filter(Boolean);

  if(records.length<20){
    return null;
  }

  return new DeliveryEngine().analyze(records as any);

}

