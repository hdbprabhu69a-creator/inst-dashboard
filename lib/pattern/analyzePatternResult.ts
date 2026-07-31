import { PatternResult } from "./types";
import { PatternAnalysis } from "./patternAnalysis";

export function analyzePatternResult(
  pattern: PatternResult
): PatternAnalysis {

  const move =
    Math.abs(pattern.target - pattern.breakout);

  const risk =
    Math.abs(pattern.breakout - pattern.stoploss);

  const rr =
    risk === 0 ? 0 : move / risk;

  const expectedMovePct =
    move / pattern.breakout * 100;

  let breakoutProbability =
    pattern.confidence;

  if (rr > 2)
    breakoutProbability += 5;

  breakoutProbability =
    Math.min(
      breakoutProbability,
      100
    );

  let stage:
    PatternAnalysis["stage"] =
    "READY";

  if (pattern.confidence < 65)
    stage = "FORMING";

  if (pattern.confidence > 90)
    stage = "BREAKOUT";

  const institutionalScore =
    Math.round(
      pattern.confidence * 0.7 +
      breakoutProbability * 0.3
    );

  let verdict:
    PatternAnalysis["verdict"];

  if (institutionalScore >= 90)
    verdict = "VERY_BULLISH";
  else if (institutionalScore >= 75)
    verdict = "BULLISH";
  else if (institutionalScore >= 60)
    verdict = "NEUTRAL";
  else
    verdict = "BEARISH";

  const reasons:string[]=[];

  if(rr>=2)
    reasons.push("Excellent Risk Reward");

  if(pattern.confidence>=85)
    reasons.push("High Confidence Pattern");

  if(expectedMovePct>8)
    reasons.push("Large Expected Move");

  return{

    pattern:pattern.pattern,

    confidence:pattern.confidence,

    stage,

    breakoutProbability,

    institutionalScore,

    breakout:pattern.breakout,

    stoploss:pattern.stoploss,

    target:pattern.target,

    expectedMovePct,

    riskReward:Number(rr.toFixed(2)),

    timeToBreakout:"3-7 Sessions",

    verdict,

    reasons,

    raw:pattern

  };

}

