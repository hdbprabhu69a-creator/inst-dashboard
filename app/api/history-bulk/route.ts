import { NextResponse } from "next/server";
import { STOCK_UNIVERSE } from "@/lib/universe";
import { getHistory } from "@/lib/history/historyRepository";

export async function GET(){

const result:Record<string,any[]>={};

await Promise.all(

STOCK_UNIVERSE.map(async(symbol)=>{

try{

result[symbol]=
await getHistory(symbol);

}catch{

result[symbol]=[];

}

})

);

return NextResponse.json(result);

}
