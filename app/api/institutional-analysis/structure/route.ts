import { NextRequest, NextResponse } from "next/server";

import { getHistory } from "@/lib/history/historyRepository";
import { getIndexHistory } from "@/lib/index/getIndexHistory";
import { resolveAsset } from "@/lib/index/indexResolver";

import { detectMultiLevelStructure } from "@/lib/structure/latestStructureEngine";
import { detectTrendChannel } from "@/lib/structure/trendChannelEngine";
import { classifyStructure } from "@/lib/structure/structureClassifier";
export async function GET(
 req:NextRequest
){

try{


 const symbol =
req.nextUrl.searchParams.get("symbol") || "SBIN";

const asset = resolveAsset(symbol);

const candles =
asset.type==="INDEX"
? await getIndexHistory(asset.symbol)
: await getHistory(symbol);

const structure =
 detectMultiLevelStructure(
  candles
 );

 if(!structure){

  return NextResponse.json(
   {
    success:false,
    error:"Unable to determine market structure."
   },
   {
    status:400
   }
  );

 }


 const channel =
 detectTrendChannel(
  structure.tradingStructure.range
    ? {
        swingHigh:{
          price:structure.tradingStructure.range.high
        },
        swingLow:{
          price:structure.tradingStructure.range.low
        }
      }
    : null
 );


 
const majorClassification =
 classifyStructure(
  structure.majorStructure.highs,
  structure.majorStructure.lows
 );

const intermediateClassification =
 classifyStructure(
  structure.intermediateStructure.highs,
  structure.intermediateStructure.lows
 );

const tradingClassification =
 classifyStructure(
  structure.tradingStructure.highs,
  structure.tradingStructure.lows
 );

const cmp=
 candles[candles.length-1].close;

const latestHigh=
 structure.tradingStructure.latestHigh?.price ?? 0;

const latestLow=
 structure.tradingStructure.latestLow?.price ?? 0;

const liveContext={

 status:
  cmp>latestHigh
   ?"ABOVE_CONFIRMED_STRUCTURE"
   :cmp<latestLow
   ?"BELOW_CONFIRMED_STRUCTURE"
   :"INSIDE_CONFIRMED_STRUCTURE",

 distanceAboveResistance:
  Number(
   (cmp-latestHigh).toFixed(2)
  ),

 distanceAboveSupport:
  Number(
   (cmp-latestLow).toFixed(2)
  )

};

return NextResponse.json({

 success:true,

 symbol,

 cmp,

 liveContext,

 latestSwings:
  structure.latestSwings,

 majorStructure:{
  ...structure.majorStructure,
  classification:majorClassification
 },

 intermediateStructure:{
  ...structure.intermediateStructure,
  classification:intermediateClassification
 },

 tradingStructure:{
  ...structure.tradingStructure,
  classification:tradingClassification
 },

 channel

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


















