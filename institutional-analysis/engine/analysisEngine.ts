import { getMarketStructure, updateEngine } from "../repository/marketStructureRepository";
import { analyzeCPR } from "./cpr/cprAnalysisEngine";

export async function runInstitutionalAnalysis(
  symbol:string
){

  const market=await getMarketStructure(symbol);

  if(!market)
    return null;

  const cpr=analyzeCPR(market);

  await updateEngine(
    symbol,
    "cpr",
    cpr
  );

  return{

    symbol,

    cpr,

    updatedAt:new Date().toISOString()

  };

}
