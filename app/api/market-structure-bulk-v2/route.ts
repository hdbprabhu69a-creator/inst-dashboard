import { NextResponse } from "next/server";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { canRunEOD } from "@/src/lib/eodGuard";
import { generateMarketStructure } from "@/lib/market/generateMarketStructure";

export async function GET() {

  if (!canRunEOD()) {

    return NextResponse.json({
      success:false,
      message:"Market Still Open",
    });

  }

  const indiaTime=new Date(
    new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"})
  );

  const today=
    indiaTime.toISOString().split("T")[0];

  const currentSession=
    (indiaTime.getHours()>15 ||
      (indiaTime.getHours()===15 &&
       indiaTime.getMinutes()>=30))
      ? "POST_CLOSE"
      : "PRE_CLOSE";

  const eodStatusRef=
    doc(db,"settings","eodStatus");

  const eodStatusDoc=
    await getDoc(eodStatusRef);

  if(eodStatusDoc.exists()){

    const data=eodStatusDoc.data();

    if(
      data?.lastRunDate===today &&
      data?.session===currentSession
    ){

      return NextResponse.json({
        success:false,
        message:"Already Updated Today",
      });

    }

  }

  const stockResult=
    await generateMarketStructure({

      sourceCollection:"universe",

      targetCollection:"marketStructure",

      includeDelivery:true,

    });

  const indexResult=
    await generateMarketStructure({

      sourceCollection:"universe_indices",

      targetCollection:"index_market_structure",

      includeDelivery:false,

    });

  if(!stockResult.success){

    return NextResponse.json(stockResult);

  }

  if(!indexResult.success){

    return NextResponse.json(indexResult);

  }

  await setDoc(

    eodStatusRef,

    {

      lastRunDate:today,

      session:currentSession,

      updatedAt:serverTimestamp(),

    },

    {merge:true}

  );

  return NextResponse.json({

    success:true,

    stocks:stockResult,

    indices:indexResult,

    updated:
      (stockResult.updated ?? 0)+
      (indexResult.updated ?? 0),

    ignored:
      (stockResult.ignored ?? 0)+
      (indexResult.ignored ?? 0),

    failed:
      (stockResult.failed ?? 0)+
      (indexResult.failed ?? 0),

    message:"BULK V2 COMPLETE",

  });

}

