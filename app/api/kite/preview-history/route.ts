import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { KiteConnect } from "kiteconnect";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

function fmt(d:any){
  const x=new Date(d);
  return `${String(x.getDate()).padStart(2,"0")}-${String(x.getMonth()+1).padStart(2,"0")}-${x.getFullYear()}`;
}

export async function GET(){

const kite=new KiteConnect({
api_key:process.env.KITE_API_KEY!,
});

kite.setAccessToken(
await getCachedAccessToken()
);

const wb=new ExcelJS.Workbook();

const summary=wb.addWorksheet("Summary");

summary.addRow([
"Symbol",
"Token",
"Candles",
"First",
"Last",
"Status"
]);

const failed=wb.addWorksheet("Failed");

failed.addRow([
"Symbol",
"Token",
"Reason"
]);

const universe=
await getDocs(
collection(db,"universe")
);

let totalCandles=0;

for(const docSnap of universe.docs){

const stock=docSnap.data();

if(!stock.instrumentToken){

failed.addRow([
stock.symbol,
"",
"NO TOKEN"
]);

continue;

}

try{

const to=new Date();

const from=new Date();

from.setMonth(
from.getMonth()-6
);

const history=
await kite.getHistoricalData(
Number(stock.instrumentToken),
"day",
from,
to,
false,
false
);

const candles=history
.map((c:any)=>({

date:new Date(c.date),

open:Number(c.open),

high:Number(c.high),

low:Number(c.low),

close:Number(c.close),

volume:Number(c.volume??0),

}))
.sort(
(a,b)=>
a.date.getTime()-
b.date.getTime()
);

const ws=
wb.addWorksheet(
String(stock.symbol).substring(0,31)
);

ws.addRow([
"Date",
"Open",
"High",
"Low",
"Close",
"Volume"
]);

for(const c of candles){

ws.addRow([
fmt(c.date),
c.open,
c.high,
c.low,
c.close,
c.volume
]);

totalCandles++;

}

summary.addRow([
stock.symbol,
stock.instrumentToken,
candles.length,
candles.length?fmt(candles[0].date):"",
candles.length?fmt(candles[candles.length-1].date):"",
"PASS"
]);

ws.views=[{state:"frozen",ySplit:1}];

}catch(e:any){

failed.addRow([
stock.symbol,
stock.instrumentToken,
e.message
]);

}

}

summary.views=[{state:"frozen",ySplit:1}];
failed.views=[{state:"frozen",ySplit:1}];

await wb.xlsx.writeFile(
"History_Preview.xlsx"
);

return NextResponse.json({
success:true,
stocks:universe.size,
candles:totalCandles,
file:"History_Preview.xlsx"
});

}
