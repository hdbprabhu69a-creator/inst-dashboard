import { InstitutionalAnalysis } from "../models/institutionalTypes";

export function calculateInstitutionalScore(
  stock: InstitutionalAnalysis
): number {

  const score =
      stock.trendScore
    + stock.structureScore
    + stock.volumeScore
    + stock.deliveryScore
    + stock.pivotScore
    + stock.cprScore
    + stock.vwapScore
    + stock.fibonacciScore
    + stock.relativeStrengthScore
    + stock.sectorScore
    + stock.macroScore
    + stock.newsScore;

  return Math.max(
    0,
    Math.min(100, score)
  );
}
