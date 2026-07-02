import {
  PatternResult,
  SwingPoint,
  TrendLine,
} from "./types";

export function scorePattern(

  pattern: PatternResult

): PatternResult {

  let score = 0;

  score += scoreTouches(
    pattern.trendLines
  );

  score += scoreSwings(
    pattern.swings
  );

  score += scoreRiskReward(
    pattern
  );

  score += scoreBreakout(
    pattern
  );

  score += scoreStructure(
    pattern
  );

  pattern.confidence =

    Math.min(
      100,
      Math.round(score)
    );

  return pattern;

}

function scoreTouches(

  lines: TrendLine[]

): number {

  let score = 0;

  for (const line of lines) {

    score +=
      Math.min(
        20,
        line.touches * 4
      );

    if (!line.broken)
      score += 6;

  }

  return score;

}

function scoreSwings(

  swings: SwingPoint[]

): number {

  if (swings.length < 4)
    return 0;

  let score = 0;

  for (const swing of swings) {

    score +=
      Math.min(
        4,
        swing.strength
      );

    switch (
      swing.classification
    ) {

      case "HH":

      case "HL":

      case "LH":

      case "LL":

        score += 2;

        break;

    }

  }

  return Math.min(
    score,
    25
  );

}

function scoreRiskReward(

  pattern: PatternResult

): number {

  const risk =

    Math.abs(

      pattern.breakout -

      pattern.stoploss

    );

  if (risk === 0)
    return 0;

  const reward =

    Math.abs(

      pattern.target -

      pattern.breakout

    );

  const rr =
    reward / risk;

  if (rr >= 3)
    return 20;

  if (rr >= 2)
    return 15;

  if (rr >= 1.5)
    return 10;

  if (rr >= 1)
    return 5;

  return 0;

}

function scoreBreakout(

  pattern: PatternResult

): number {

  const move =

    Math.abs(

      pattern.target -

      pattern.breakout

    );

  if (move <= 0)
    return 0;

  if (move > 100)
    return 15;

  if (move > 50)
    return 12;

  if (move > 20)
    return 10;

  if (move > 10)
    return 6;

  return 3;

}

function scoreStructure(

  pattern: PatternResult

): number {

  switch (

    pattern.pattern

  ) {

    case "HEAD_SHOULDER":

    case "INVERSE_HEAD_SHOULDER":

      return 20;

    case "DOUBLE_TOP":

    case "DOUBLE_BOTTOM":

      return 18;

    case "ASC_TRIANGLE":

    case "DESC_TRIANGLE":

    case "SYM_TRIANGLE":

      return 16;

    case "BULL_FLAG":

    case "BEAR_FLAG":

      return 15;

    case "CHANNEL":

      return 14;

    case "RISING_WEDGE":

    case "FALLING_WEDGE":

      return 13;

    case "CUP_HANDLE":

      return 18;

    default:

      return 5;

  }

}
