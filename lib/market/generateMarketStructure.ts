import { processAsset } from "@/lib/market/processAsset";

import { KiteConnect } from "kiteconnect";
import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { getCachedAccessToken } from "@/lib/kite/tokenCache";

import {
    loadInstrumentMap
} from "@/src/lib/kiteData";

export interface GenerateMarketStructureOptions{

    sourceCollection:string;

    targetCollection:string;

    includeDelivery:boolean;

}

export async function generateMarketStructure(

    options:GenerateMarketStructureOptions

){

    const accessToken=await getCachedAccessToken();

    if(!accessToken){

        return{

            success:false,

            error:"No Access Token"

        };

    }

    const kite=new KiteConnect({

        api_key:process.env.KITE_API_KEY!

    });

    kite.setAccessToken(accessToken);

    const instrumentMap=

        await loadInstrumentMap();

    const snapshot=

        await getDocs(

            collection(

                db,

                options.sourceCollection

            )

        );

    const assets=

        snapshot.docs.map(doc=>({

            id:doc.id,

            ...doc.data()

        }));

    let updated=0;

let ignored=0;

let failed=0;

const updatedSymbols:string[]=[];

const ignoredSymbols:string[]=[];

const failedSymbols:string[]=[];

for(const stock of assets){

    const result=

        await processAsset(

            stock,

            {

                kite,

                instrumentMap,

                targetCollection:options.targetCollection,

                includeDelivery:options.includeDelivery,

                skipNiftySymbols:options.sourceCollection==="universe",

            }

        );

    switch(result.status){

        case "updated":

            updated++;

            updatedSymbols.push(result.symbol);

            break;

        case "ignored":

            ignored++;

            ignoredSymbols.push(result.symbol);

            break;

        case "failed":
failed++;

            failedSymbols.push(result.symbol);

    }

}

return{

    success:true,

    total:assets.length,

    updated,

    ignored,

    failed,

    updatedSymbols,

    ignoredSymbols,

    failedSymbols,

};

}












