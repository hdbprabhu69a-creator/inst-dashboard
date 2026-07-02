import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import {
  createHistoryWorkbook,
  createSummarySheet,
  createStockSheet,
  sortHistoryDescending,
  firestoreIdToExcelDate
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

const ws=createStockSheet(
wb,
String(s.symbol)
);

const history=await getDocs(
collection(
db,
"universe",
stock.id,
"history"
)
);

const rows=sortHistoryDescending(
history.docs
);

for(const r of rows){

const c=r.data();



ws.addRow({

date:firestoreIdToExcelDate(
r.id
),

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

latest:rows.length
?firestoreIdToExcelDate(
rows[0].id
)
:"",

earliest:rows.length
?firestoreIdToExcelDate(
rows[rows.length-1].id
)
:""

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







