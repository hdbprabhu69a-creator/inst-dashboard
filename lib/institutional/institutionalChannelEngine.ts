import {
  buildInstitutionalTrendline,
} from "./institutionalTrendlineEngine";

export function buildInstitutionalChannel(
  marketStructure: any,
  structure: string
) {
  const trendline =
    buildInstitutionalTrendline(
      marketStructure,
      structure
    );

  if (!trendline)
    return null;

  const upper =
    Math.max(
      marketStructure.oneWeekSwing.high,
      marketStructure.twoWeekSwing.high,
      marketStructure.oneMonthSwing.high
    );

  const lower =
    Math.min(
      marketStructure.oneWeekSwing.low,
      marketStructure.twoWeekSwing.low,
      marketStructure.oneMonthSwing.low
    );

  return {
    trendline,
    upper,
    lower,
    width: upper - lower,
  };
}
