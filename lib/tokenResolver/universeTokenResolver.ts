import fs from "fs";
import path from "path";
import { loadInstrumentCsv } from "./csvLoader";

let cache:number[]|null=null;

export function getUniverseTokens():number[]{

    if(cache){
        return cache;
    }

    const universePath=
        path.resolve("PIVOT_STOCK_LIST_UPGRADED.csv");

    const universe=
        fs.readFileSync(universePath,"utf8")
          .split(/\r?\n/)
          .slice(1)
          .map(v=>v.trim().split(",")[0].toUpperCase())
          .filter(Boolean);

    const instruments=
        loadInstrumentCsv("data/zerodha-instruments.csv");

    const set=
        new Set(universe);

    cache=
        instruments
            .filter(i=>set.has(i.symbol))
            .map(i=>i.token);

    console.log(
        "[UniverseTokenResolver] Symbols:",
        universe.length
    );

    console.log(
        "[UniverseTokenResolver] Tokens:",
        cache.length
    );

    return cache;

}

