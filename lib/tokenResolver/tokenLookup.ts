import { loadInstrumentCsv } from "./csvLoader";

let tokenMap: Map<number,string> | null = null;

function ensureLoaded() {

    if (tokenMap) return;

    tokenMap = new Map();

    for (const row of loadInstrumentCsv("data/zerodha-instruments.csv")) {

        tokenMap.set(Number(row.token), row.symbol);

    }

}

export function getSymbolFromToken(token:number):string|undefined {

    ensureLoaded();

    return tokenMap!.get(Number(token));

}

