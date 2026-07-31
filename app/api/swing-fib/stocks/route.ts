import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/lib/firebase";

import { getLivePrices } from "@/lib/kite/getLivePrices";

export async function GET() {

  try {

    const [marketSnapshot, heatmapSnapshot] =
      await Promise.all([

        getDocs(
          collection(
            db,
            "marketStructure"
          )
        ),

        getDocs(
          collection(
            db,
            "heatmap_cache"
          )
        ),

      ]);


    const sectorMap =
      new Map<string, string>();


    heatmapSnapshot.docs.forEach(doc => {

      const data: any =
        doc.data();

      sectorMap.set(

        data.symbol ?? doc.id,

        data.sector ??
        "UNKNOWN"

      );

    });


    const symbols =
      marketSnapshot.docs.map(
        doc => doc.id
      );


    const livePrices =
      await getLivePrices(
        symbols
      );


    const stocks =
      marketSnapshot.docs

        .map(doc => {

          const data: any =
            doc.data();

          return {

            symbol:
              doc.id,

            sector:
              sectorMap.get(
                doc.id
              ) ??
              "UNKNOWN",

            ...data,

            liveCmp:
              livePrices[
                doc.id
              ] ??
              data.cmp ??
              0,

          };

        })

        .sort(
          (a: any, b: any) =>
            a.symbol.localeCompare(
              b.symbol
            )
        );


    return NextResponse.json({

      success: true,

      total:
        stocks.length,

      stocks,

    });

  }

  catch (error: any) {

    return NextResponse.json(

      {

        success: false,

        error:
          error.message,

      },

      {

        status: 500,

      }

    );

  }

}