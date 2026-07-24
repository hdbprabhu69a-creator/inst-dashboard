import { INDEX_SYMBOLS } from "./indexSymbols";
import type { AssetInfo } from "./indexTypes";

export function resolveAsset(symbol:string):AssetInfo{

    const key=symbol.trim().toUpperCase();

    const displayName=(INDEX_SYMBOLS as Record<string,string>)[key];

    if(displayName){

        return{

            symbol:key,

            displayName,

            type:"INDEX"

        };

    }

    return{

        symbol:key,

        displayName:key,

        type:"STOCK"

    };

}
