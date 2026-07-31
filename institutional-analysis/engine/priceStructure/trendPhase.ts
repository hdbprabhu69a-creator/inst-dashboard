import { TrendPhase } from "../../models/priceStructureTypes";

export function trendPhase(
  structure: string,
  integrity: boolean,
  higherHighs: number,
  higherLows: number,
  lowerHighs: number,
  lowerLows: number
): TrendPhase {

  if (structure === "HH_HL") {

    if (!integrity)
      return "ACCUMULATION";

    if (higherHighs >= 8 && higherLows >= 8)
      return "MATURE_UPTREND";

    return "EARLY_UPTREND";
  }

  if (structure === "LH_LL") {

    if (!integrity)
      return "DISTRIBUTION";

    if (lowerHighs >= 8 && lowerLows >= 8)
      return "MATURE_DOWNTREND";

    return "EARLY_DOWNTREND";
  }

  return "SIDEWAYS";

}

