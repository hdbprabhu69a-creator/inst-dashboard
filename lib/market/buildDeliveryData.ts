import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function buildDeliveryData(

  symbol:string,

  completedWeekDates:Set<string>,

  completedMonthDates:Set<string>,

  includeDelivery:boolean,

){

  if(!includeDelivery){

    return{

      totalDeliveryDaily:0,
      deliveryPctDaily:0,

      totalDeliveryWeekly:0,
      deliveryPctWeekly:0,

      totalDeliveryMonthly:0,
      deliveryPctMonthly:0,

    };

  }

  const deliverySnapshot=
    await getDocs(
      query(
        collection(
          db,
          "delivery_history"
        ),
        where(
          "symbol",
          "==",
          symbol
        )
      )
    );

  const deliveryRecords=
    deliverySnapshot.docs.map(
      doc=>doc.data()
    );

  const latestDelivery=
    deliveryRecords
      .sort(
        (a:any,b:any)=>
          new Date(b.date).getTime()-
          new Date(a.date).getTime()
      )[0];

  const totalDeliveryDaily=
    latestDelivery?.deliveryQty||0;

  const deliveryPctDaily=
    latestDelivery?.deliveryPct||0;

  const weeklyDeliveryRecords=
    deliveryRecords.filter(
      (row:any)=>
        completedWeekDates.has(
          row.date
        )
    );

  const totalDeliveryWeekly=
    weeklyDeliveryRecords.reduce(
      (sum:number,row:any)=>
        sum+(row.deliveryQty||0),
      0
    );

  const totalWeeklyVolume=
    weeklyDeliveryRecords.reduce(
      (sum:number,row:any)=>
        sum+(row.volume||0),
      0
    );

  const deliveryPctWeekly=
    totalWeeklyVolume>0
      ?Number(
        (
          totalDeliveryWeekly/
          totalWeeklyVolume*
          100
        ).toFixed(2)
      )
      :0;

  const monthlyDeliveryRecords=
    deliveryRecords.filter(
      (row:any)=>
        completedMonthDates.has(
          row.date
        )
    );

  const totalDeliveryMonthly=
    monthlyDeliveryRecords.reduce(
      (sum:number,row:any)=>
        sum+(row.deliveryQty||0),
      0
    );

  const totalMonthlyVolume=
    monthlyDeliveryRecords.reduce(
      (sum:number,row:any)=>
        sum+(row.volume||0),
      0
    );

  const deliveryPctMonthly=
    totalMonthlyVolume>0
      ?Number(
        (
          totalDeliveryMonthly/
          totalMonthlyVolume*
          100
        ).toFixed(2)
      )
      :0;

  return{

    totalDeliveryDaily,
    deliveryPctDaily,

    totalDeliveryWeekly,
    deliveryPctWeekly,

    totalDeliveryMonthly,
    deliveryPctMonthly,

  };

}

