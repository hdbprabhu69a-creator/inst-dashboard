import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(){

    const snapshot=await adminDb
        .collection("contract_trades")
        .get();

    const trades=snapshot.docs
        .map(doc=>({

            id:doc.id,

            ...doc.data()

        }))
        .sort((a:any,b:any)=>{

            if(a.tradeDate!==b.tradeDate){

                return a.tradeDate.localeCompare(b.tradeDate);

            }

            return (a.tradeTime??"")
                .localeCompare(b.tradeTime??"");

        });

    return NextResponse.json({

        success:true,

        count:trades.length,

        data:trades

    });

}
