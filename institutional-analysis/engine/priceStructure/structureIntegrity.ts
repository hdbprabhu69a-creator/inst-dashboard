export interface StructureIntegrityResult {
  intact: boolean;
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  protectedLevel: number | null;
  brokenLevel: number | null;
  breakDistance: number;
  verdict: "INTACT" | "BROKEN";
}

export function structureIntegrity(
  structure: string,
  close: number,
  lastHigherLow: number | null,
  lastLowerHigh: number | null
): StructureIntegrityResult {

  if (structure === "HH_HL") {

    if (lastHigherLow === null) {
      return {
        intact: true,
        direction: "BULLISH",
        protectedLevel: null,
        brokenLevel: null,
        breakDistance: 0,
        verdict: "INTACT"
      };
    }

    const broken = close < lastHigherLow;

    return {
      intact: !broken,
      direction: "BULLISH",
      protectedLevel: lastHigherLow,
      brokenLevel: broken ? lastHigherLow : null,
      breakDistance: Math.abs(close - lastHigherLow),
      verdict: broken ? "BROKEN" : "INTACT"
    };
  }

  if (structure === "LH_LL") {

    if (lastLowerHigh === null) {
      return {
        intact: true,
        direction: "BEARISH",
        protectedLevel: null,
        brokenLevel: null,
        breakDistance: 0,
        verdict: "INTACT"
      };
    }

    const broken = close > lastLowerHigh;

    return {
      intact: !broken,
      direction: "BEARISH",
      protectedLevel: lastLowerHigh,
      brokenLevel: broken ? lastLowerHigh : null,
      breakDistance: Math.abs(close - lastLowerHigh),
      verdict: broken ? "BROKEN" : "INTACT"
    };
  }

  return {
    intact: true,
    direction: "NEUTRAL",
    protectedLevel: null,
    brokenLevel: null,
    breakDistance: 0,
    verdict: "INTACT"
  };
}

