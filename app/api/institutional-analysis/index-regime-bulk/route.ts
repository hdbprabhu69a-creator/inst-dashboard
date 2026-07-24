import { NextResponse } from "next/server";

import {
  getDocs,
  collection
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  getIndexHistory
} from "@/lib/history/indexHistoryRepository";

import {
  analyzeIndexRegime
} from "@/lib/institutional/indexRegimeEngine";


export async function GET(){

 try{

   const snapshot =
     await getDocs(
       collection(
         db,
         "universe_indices"
       )
     );


   const results:any[]=[];


   for(const doc of snapshot.docs){

     const data:any =
       doc.data();


     const symbol =
       data.symbol;


     if(!symbol)
       continue;


     const candles =
       await getIndexHistory(
         symbol
       );


     const regime =
       analyzeIndexRegime(
         candles
       );


     results.push({

       symbol,

       candles:
         candles.length,

       data:regime

     });

   }


   return NextResponse.json({

     success:true,

     total:
       results.length,

     indices:
       results

   });


 }
 catch(error:any){

   return NextResponse.json({

     success:false,

     error:error.message

   },{
     status:500
   });

 }

}
