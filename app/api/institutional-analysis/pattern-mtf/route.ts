import {
 NextRequest,
 NextResponse
} from "next/server";


import {
 getHistory
} from "@/lib/history/historyRepository";


import {
 analyzeMultiTimeframePattern
} from "@/lib/pattern/multiTimeframePatternEngine";

import {
 analyzePatternLifecycle
} from "@/lib/pattern/patternLifecycleEngine";



export async function GET(
 req:NextRequest
){


try{


const symbol =
 req.nextUrl.searchParams.get(
  "symbol"
 );


if(!symbol)
 return NextResponse.json({
  success:false,
  error:"symbol required"
 });



const daily =
 await getHistory(
  symbol
 );


if(!daily.length)
 return NextResponse.json({
  success:false,
  error:"No history"
 });



const currentPrice =
 daily[daily.length-1].close;



// temporary aggregation
// weekly/monthly will use candle aggregator next

const weekly =
 daily.filter(
 (_,i)=>
 i%5===0
 );


const monthly =
 daily.filter(
 (_,i)=>
 i%20===0
 );



const patterns =
 analyzeMultiTimeframePattern(

  daily,

  weekly,

  monthly,

  currentPrice

 );


let lifecycle=null;


if(patterns.length){

 lifecycle =
  analyzePatternLifecycle(

    daily,

    patterns[0],

    currentPrice

  );

}



return NextResponse.json({

 success:true,

 symbol,

 cmp:currentPrice,

 patterns,

 lifecycle

});


}
catch(e:any){

return NextResponse.json({

 success:false,

 error:e.message

},{
 status:500
});

}


}

