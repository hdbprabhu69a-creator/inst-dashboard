import {
  PatternResult,
  PatternType,
  SwingPoint,
  TrendLine,
} from "./types";

import {
  buildTrendLines,
  getBestTrendLine,
} from "./trendlineEngine";

export function detectRisingChannel(
  swings: SwingPoint[]
): PatternResult | null {

  const upper =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lower =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if (!upper || !lower)
    return null;

  if (
    upper.slope <= 0 ||
    lower.slope <= 0
  )
    return null;

  if (
    Math.abs(
      upper.slope -
      lower.slope
    ) > 0.15
  )
    return null;

  return buildChannel(
    "CHANNEL",
    upper,
    lower
  );

}

export function detectFallingChannel(
  swings: SwingPoint[]
): PatternResult | null {

  const upper =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lower =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if (!upper || !lower)
    return null;

  if (
    upper.slope >= 0 ||
    lower.slope >= 0
  )
    return null;

  if (
    Math.abs(
      upper.slope -
      lower.slope
    ) > 0.15
  )
    return null;

  return buildChannel(
    "CHANNEL",
    upper,
    lower
  );

}

function buildChannel(

  pattern:
    PatternResult["pattern"],

  upper:
    TrendLine,

  lower:
    TrendLine

): PatternResult {

  const height =

    upper.start.price -

    lower.start.price;

  const breakout =

    upper.end.price;

  const stoploss =

    lower.end.price;

  const target =

    breakout +

    height;

  let confidence = 65;

  confidence +=

    upper.touches * 4;

  confidence +=

    lower.touches * 4;

  if (!upper.broken)
    confidence += 8;

  if (!lower.broken)
    confidence += 8;

  confidence = Math.min(
    confidence,
    100
  );

  return {

    pattern,

    confidence,

    breakout,

    stoploss,

    target,

    swings: [

      upper.start,

      upper.end,

      lower.start,

      lower.end,

    ],

    trendLines: [

      upper,

      lower,

    ],

    points: [

      {

        label: "A",

        swing:
          upper.start,

      },

      {

        label: "B",

        swing:
          lower.start,

      },

      {

        label: "C",

        swing:
          upper.end,

      },

      {

        label: "D",

        swing:
          lower.end,

      },

    ],

  };

}
export function getBestChannel(
  swings: SwingPoint[]
){

  const upper =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "HIGH"
      )
    );

  const lower =
    getBestTrendLine(
      buildTrendLines(
        swings,
        "LOW"
      )
    );

  if(!upper || !lower)
    return null;

  const pattern: PatternType = "CHANNEL";


  return {

    pattern,

    confidence:
      Math.min(
        60 +
        upper.touches * 5 +
        lower.touches * 5,
        100
      ),

    breakout:
      upper.end.price,

    stoploss:
      lower.end.price,

    target:
      upper.end.price +
      (upper.end.price - lower.end.price),

    swings:[
      upper.start,
      upper.end,
      lower.start,
      lower.end
    ],

    trendLines:[
      upper,
      lower
    ],

    points:[
      {
        label:"A",
        swing:upper.start
      },
      {
        label:"B",
        swing:lower.start
      },
      {
        label:"C",
        swing:upper.end
      },
      {
        label:"D",
        swing:lower.end
      }
    ]

  };

}


export function getChannelStatus(
  cmp:number,
  channel:PatternResult
){

  const line1 =
    channel.trendLines[0];

  const line2 =
    channel.trendLines[1];

  const price1 =
    line1.end.price;

  const price2 =
    line2.end.price;

  const upperPrice =
    Math.max(
      price1,
      price2
    );

  const lowerPrice =
    Math.min(
      price1,
      price2
    );

  return {

    upper: upperPrice,

    lower: lowerPrice,

    status:
      cmp > upperPrice
        ? "BREAKOUT"
        : cmp < lowerPrice
          ? "BREAKDOWN"
          : "INSIDE"

  };

}





