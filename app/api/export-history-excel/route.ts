import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { collection,getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function fmt(d:string){

const p=d.split("-");

if(p.length!==3) return d;

return `${p[2]}-${p[1]}-${p[0]}`;

}

export async function GET(){

const wb=new ExcelJS.Workbook();

wb.creator="Institution Dashboard";

const summary=wb.addWorksheet("Summary");

summary.columns=[
{header:"Symbol",key:"symbol",width:18},
{header:"Instrument Token",key:"token",width:18},
{header:"Candles",key:"count",width:12},
{header:"Latest Date",key:"latest",width:16},
{header:"Earliest Date",key:"earliest",width:16}
];

summary.getRow(1).font={bold:true};

summary.views=[{state:"frozen",ySplit:1}];

summary.autoFilter="A1:E1";

const universe=await getDocs(collection(db,"universe"));

const stocks=[...universe.docs].sort(
(a,b)=>
String(a.data().symbol).localeCompare(
String(b.data().symbol)
)
);

for(const stock of stocks){

const s=stock.data();

const ws=wb.addWorksheet(
String(s.symbol).substring(0,31)
);

ws.columns=[
{header:"Date",key:"date",width:15},
{header:"Open",key:"open",width:12},
{header:"High",key:"high",width:12},
{header:"Low",key:"low",width:12},
{header:"Close",key:"close",width:12},
{header:"Volume",key:"volume",width:18},
{header:"Instrument Token",key:"token",width:18}
];

ws.getRow(1).font={bold:true};

ws.views=[{state:"frozen",ySplit:1}];

ws.autoFilter="A1:G1";

const history=await getDocs(
collection(
db,
"universe",
stock.id,
"history"
)
);

const rows=[...history.docs].sort(
(a,b)=>b.id.localeCompare(a.id)
);

for(const r of rows){

const c=r.data();

ws.addRow({

date:fmt(r.id),

open:c.open,

high:c.high,

low:c.low,

close:c.close,

volume:c.volume,

token:s.instrumentToken

});

}

summary.addRow({

symbol:s.symbol,

token:s.instrumentToken,

count:rows.length,

latest:rows.length?fmt(rows[0].id):"",

earliest:rows.length?fmt(rows[rows.length-1].id):""

});

}

const buffer=Buffer.from(
await wb.xlsx.writeBuffer()
);

return new NextResponse(buffer,{
headers:{
"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
"Content-Disposition":'attachment; filename="History_Verification.xlsx"'
}
});

}
