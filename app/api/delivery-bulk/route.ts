import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";

import { db } from "@/lib/firebase";

import {
  importDeliveryCsv,
} from "@/src/lib/sharedDeliveryImporter";


export async function GET() {

  try {

    const deliveryFolder = path.join(
      process.cwd(),
      "data",
      "delivery"
    );

    const files = fs
      .readdirSync(deliveryFolder)
      .filter(f => f.toLowerCase().endsWith(".csv"))
      .sort();

    if(files.length===0){

      return NextResponse.json({
        success:false,
        error:"No delivery files found"
      });

    }

    let written=0;
    let updated=0;
    let failed=0;

    for(const file of files){

      const result =
        await importDeliveryCsv(
          path.join(deliveryFolder,file)
        );

      written += result.written;
      updated += result.updated;
      failed += result.failed;

    }

    return NextResponse.json({

      success:true,

      filesProcessed:files.length,

      written,

      updated,

      failed

    });

  } catch(error:any){

    return NextResponse.json({

      success:false,

      error:error.message

    });

  }

}

