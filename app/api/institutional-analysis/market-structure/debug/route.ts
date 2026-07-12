import { NextResponse } from "next/server";
import { getMarketStructure } from "@/institutional-analysis/repository/marketStructureRepository";

export async function GET(){

  const symbol="SBIN";

  const ms=await getMarketStructure(symbol);

  if(!ms){

    return NextResponse.json({
      success:false,
      error:"Market Structure not found"
    });

  }

  return NextResponse.json({
    success:true,
    symbol,
    fields:Object.keys(ms).sort(),
    data:ms
  });

}
