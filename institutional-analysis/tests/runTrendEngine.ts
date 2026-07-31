import { loadHistory } from "../services/historyLoader";

async function main(){

    const candles = await loadHistory("SBIN");

    console.log("");
    console.log("====================================");
    console.log("TREND ENGINE HISTORY TEST");
    console.log("====================================");
    console.log("Candles :", candles.length);

    if(candles.length){

        console.log("First :", candles[0]);
        console.log("Last  :", candles[candles.length-1]);

    }

}

main().catch(console.error);

