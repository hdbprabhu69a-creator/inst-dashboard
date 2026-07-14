import fs from "fs";
import csv from "csv-parser";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  buildDeliveryRecord,
} from "@/src/lib/deliveryEngine";

function convertDate(dateStr:string){

  const months:Record<string,string>={
    Jan:"01",
    Feb:"02",
    Mar:"03",
    Apr:"04",
    May:"05",
    Jun:"06",
    Jul:"07",
    Aug:"08",
    Sep:"09",
    Oct:"10",
    Nov:"11",
    Dec:"12"
  };

  const [day,mon,year]=dateStr.split("-");

  return `${year}-${months[mon]}-${day}`;

}

export async function importDeliveryCsv(csvFile:string){

  const universeSnapshot=
    await getDocs(
      collection(
        db,
        "universe"
      )
    );

  const universeSymbols=
    universeSnapshot.docs.map(
      doc=>doc.data().symbol
    );

  console.log("[IMPORT] Universe:",universeSymbols.length);

  const rows:any[]=[];

  await new Promise<void>((resolve,reject)=>{

    fs.createReadStream(csvFile)

      .pipe(
        csv({
          mapHeaders:({header})=>header.trim()
        })
      )

      .on("data",data=>{
        rows.push(
          buildDeliveryRecord(data)
        );
      })

      .on("end",()=>resolve())

      .on("error",reject);

  });

  console.log("[IMPORT] Parsed Rows:",rows.length);

  const filtered=
    rows.filter(
      row=>universeSymbols.includes(row.symbol)
    );

  console.log("[IMPORT] Filtered Rows:",filtered.length);

  let written=0;
  let updated=0;
  let failed=0;

  for(const stock of filtered){

    try{

      const isoDate=
        convertDate(stock.date);

      const docId=
        `${stock.symbol}_${isoDate}`;

      const docRef=
        doc(
          db,
          "delivery_history",
          docId
        );

      const existing=
        await getDoc(docRef);

      await setDoc(

        docRef,

        {
          symbol:stock.symbol,
          date:isoDate,
          volume:stock.volume,
          deliveryQty:stock.deliveryQty,
          deliveryPct:stock.deliveryPct,
          updatedAt:Date.now()
        },

        {
          merge:true
        }

      );

      if(existing.exists()){

        updated++;

      }else{

        written++;

      }

    }catch(error){

      failed++;

      console.error(
        "[IMPORT ERROR]",
        stock.symbol,
        stock.date,
        error
      );

    }

  }

  return{

    success:true,

    written,

    updated,

    failed

  };

}



