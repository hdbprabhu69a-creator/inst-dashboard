import { loadInstrumentCsv } from "./csvLoader";

let tokens:number[]|null=null;

export function getServerTokens():number[]{

    if(tokens){
        return tokens;
    }

    const instruments=
        loadInstrumentCsv("data/zerodha-instruments.csv");

    tokens=
        instruments.map(i=>i.token);

    console.log(
        "[ServerTokenResolver] Loaded",
        tokens.length,
        "tokens."
    );

    return tokens;

}

