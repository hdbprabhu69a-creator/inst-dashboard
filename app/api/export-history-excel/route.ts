import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import {
  createHistoryWorkbook,
  createSummarySheet
} from "@/lib/export/historyWorkbook";
import { collection,getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

function excelDate(d:string){

const p=d.split("-");

return new Date(
Number(p[0]),
Number(p[1])-1,
Number(p[2])
);

}

export async function GET(){

const wb=createHistoryWorkbook();

const summary=createSummarySheet(wb);

summary.getColumn("latest").numFmt="dd-mm-yyyy";
summary.getColumn("earliest").numFmt="dd-mm-yyyy";

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

ws.getColumn("date").numFmt="dd-mm-yyyy";

const history=await getDocs(
collection(
db,
"universe",
stock.id,
"history"
)
);

const rows=[...history.docs]
.sort((a,b)=>b.id.localeCompare(a.id));

for(const r of rows){

const c=r.data();



ws.addRow({

date:excelDate(r.id),

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

latest:rows.length?excelDate(rows[0].id):"",

earliest:rows.length?excelDate(rows[rows.length-1].id):""

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





