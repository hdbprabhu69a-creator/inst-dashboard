import {
  PatternResult,
  SwingPoint,
} from "./types";

const CUP_TOLERANCE = 0.03;

export function detectCupHandle(
  swings: SwingPoint[]
): PatternResult | null {

  const highs =
    swings.filter(
      s => s.type === "HIGH"
    );

  const lows =
    swings.filter(
      s => s.type === "LOW"
    );

  if (
    highs.length < 2 ||
    lows.length < 1
  ) {
    return null;
  }

  for (
    let i = 0;
    i < highs.length - 1;
    i++
  ) {

    const left =
      highs[i];

    const right =
      highs[i + 1];

    const diff =
      Math.abs(
        left.price -
        right.price
      );

    if (
      diff >
      left.price *
      CUP_TOLERANCE
    ) {
      continue;
    }

    const cupLow =
      lows.find(
        l =>
          l.index > left.index &&
          l.index < right.index
      );

    if (!cupLow)
      continue;

    const depth =
      left.price -
      cupLow.price;

    if (
      depth <= 0
    )
      continue;

    const handleLow =
      lows.find(
        l =>
          l.index > right.index
      );

    if (!handleLow)
      continue;

    if (
      handleLow.price <
      cupLow.price
    )
      continue;

    const breakout =
      Math.max(
        left.price,
        right.price
      );

    const stoploss =
      handleLow.price;

    const target =
      breakout +
      depth;

    const confidence =
      calculateConfidence(
        left,
        right,
        cupLow,
        handleLow
      );

    return {

      pattern:
        "CUP_HANDLE",

      confidence,

      breakout,

      stoploss,

      target,

      swings: [

        left,

        cupLow,

        right,

        handleLow,

      ],

      trendLines: [],

      points: [

        {

          label: "Left Rim",

          swing: left,

        },

        {

          label: "Cup Low",

          swing: cupLow,

        },

        {

          label: "Right Rim",

          swing: right,

        },

        {

          label: "Handle",

          swing: handleLow,

        },

      ],

    };

  }

  return null;

}

function calculateConfidence(

  left: SwingPoint,

  right: SwingPoint,

  cupLow: SwingPoint,

  handleLow: SwingPoint

): number {

  let score = 60;

  const rimDifference =

    Math.abs(

      left.price -

      right.price

    );

  if (

    rimDifference <=

    left.price * 0.01

  ) {

    score += 15;

  }

  const handleDepth =

    right.price -

    handleLow.price;

  const cupDepth =

    left.price -

    cupLow.price;

  if (

    handleDepth <

    cupDepth * 0.5

  ) {

    score += 15;

  }

  const symmetry =

    Math.abs(

      (cupLow.index - left.index) -

      (right.index - cupLow.index)

    );

  if (

    symmetry <= 5

  ) {

    score += 10;

  }

  return Math.min(
    score,
    100
  );

}

