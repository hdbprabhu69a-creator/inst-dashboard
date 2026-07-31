import { NextResponse } from "next/server";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { canRunEOD } from "@/src/lib/eodGuard";
import { generateMarketStructure } from "@/lib/market/generateMarketStructure";

export async function GET(){

    if(!canRunEOD()){

        return NextResponse.json({

            success:false,

            message:"Market Still Open",

        });

    }

    const indiaTime=new Date(

        new Date().toLocaleString(

            "en-US",

            {timeZone:"Asia/Kolkata"}

        )

    );

    const today=indiaTime.toISOString().split("T")[0];

    const currentSession=(

        indiaTime.getHours()>15 ||

        (

            indiaTime.getHours()===15 &&

            indiaTime.getMinutes()>=30

        )

    )

        ?"POST_CLOSE"

        :"PRE_CLOSE";

    const eodStatusRef=doc(

        db,

        "settings",

        "indexEodStatus"

    );

    const eodStatusDoc=await getDoc(eodStatusRef);

    if(eodStatusDoc.exists()){

        const lastRunDate=eodStatusDoc.data()?.lastRunDate;

        const lastSession=eodStatusDoc.data()?.session;

        if(

            lastRunDate===today &&

            lastSession===currentSession

        ){

            return NextResponse.json({

                success:false,

                message:"Already Updated Today",

            });

        }

    }

    const result=await generateMarketStructure({

        sourceCollection:"universe_indices",

        targetCollection:"indexMarketStructure",

        includeDelivery:false,

    });

    if(result.success){

        await setDoc(

            eodStatusRef,

            {

                lastRunDate:today,

                session:currentSession,

                updatedAt:serverTimestamp(),

            },

            {

                merge:true,

            }

        );

    }

    return NextResponse.json(result);

}

