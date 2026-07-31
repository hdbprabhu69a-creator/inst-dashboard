import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { DeliveryEngine } from "@/lib/delivery-analysis/DeliveryEngine";

export async function GET(request:NextRequest){

  try{

    const symbol=request.nextUrl.searchParams.get("symbol");

    if(!symbol){
      return NextResponse.json({success:false,error:"symbol is required"},{status:400});
    }

    const snap=await adminDb
      .collection("delivery_history")
      .where("symbol","==",symbol)
      .get();

    const deliveryRecords=snap.docs
      .map(d=>d.data())
      .sort((a:any,b:any)=>String(a.date).localeCompare(String(b.date)));

    const historySnap=await adminDb
      .collection("marketHistory")
      .doc(symbol)
      .collection("daily")
      .orderBy("date")
      .get();

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
      .filter(Boolean)

    const engine=new DeliveryEngine();

    const results=[];

    for(let i=20;i<=records.length;i++){

      const slice=records.slice(0,i);

      try{

        const analysis=engine.analyze(slice as any);

        results.push({

          date:slice.at(-1)?.date,

          composite:analysis.scores.composite.value,

          institutional:analysis.scores.institutional.value,

          trendScore:analysis.scores.trend.value,

          confidence:analysis.scores.confidence.value,

          trend:analysis.trend.classification,

          signal:analysis.signals.signal

        });

      }catch(e:any){

        console.error("BACKTEST ERROR:", slice.at(-1)?.date);

        console.error(e);

        throw e;

      }

    }

    return NextResponse.json({

      success:true,

      symbol,

      totalRuns:results.length,

      history:results

    });

  }catch(e:any){

    return NextResponse.json({

      success:false,

      error:e.message

    },{status:500});

  }

}



