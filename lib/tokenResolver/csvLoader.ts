import fs from "fs";
import path from "path";
import { InstrumentInfo } from "./types";

export function parseInstrumentCsv(csv:string):InstrumentInfo[]{
    const lines=csv.split(/\r?\n/).filter(Boolean);
    if(lines.length<2) return [];

    const headers=lines[0].split(",");
    const idx=(n:string)=>headers.indexOf(n);

    const out:InstrumentInfo[]=[];

    for(let i=1;i<lines.length;i++){
        const c=lines[i].split(",");
        out.push({
            token:Number(c[idx("instrument_token")]),
            symbol:(c[idx("tradingsymbol")]||"").toUpperCase(),
            exchange:c[idx("exchange")]||"",
            tradingsymbol:c[idx("tradingsymbol")]||"",
            tickSize:Number(c[idx("tick_size")]||0),
            lotSize:Number(c[idx("lot_size")]||0)
        });
    }

    return out;
}

export function loadInstrumentCsv(file:string):InstrumentInfo[]{
    const csv=fs.readFileSync(path.resolve(file),"utf8");
    return parseInstrumentCsv(csv);
}

