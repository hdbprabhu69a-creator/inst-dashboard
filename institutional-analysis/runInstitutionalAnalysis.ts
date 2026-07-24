import { getMarketStructure, updateEngine } from "./repository/marketStructureRepository";
import { analyzeCPR } from "./engine/cpr/cprAnalysisEngine";
import { analyzePriceStructure } from "./engine/priceStructure/priceStructureEngine";

export async function runInstitutionalAnalysis(symbol:string){

    const market=await getMarketStructure(symbol);

    if(!market)
        return null;

    const cpr=analyzeCPR(market);

    const priceStructure=analyzePriceStructure(
        market.history ?? []
    );

    await Promise.all([

        updateEngine(
            symbol,
            "cpr",
            cpr
        ),

        updateEngine(
            symbol,
            "priceStructure",
            priceStructure
        )

    ]);

    return{

        symbol,

        cpr,

        priceStructure,

        updatedAt:new Date().toISOString()

    };

}
