import {
  PatternResult,
  SwingPoint,
} from "./types";

const PRICE_TOLERANCE = 0.015;

export function detectDoubleTop(
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

    const diff = Math.abs(

      left.price -
      right.price

    );

    if (

      diff >

      left.price *
        PRICE_TOLERANCE

    ) {

      continue;

    }

    const valley =
      lows.find(

        l =>

          l.index > left.index &&

          l.index < right.index

      );

    if (!valley)
      continue;

    const neckline =
      valley.price;

    const height =

      left.price -

      neckline;

    return {

      pattern:
        "DOUBLE_TOP",

      confidence: 82,

      breakout:
        neckline,

      stoploss:
        right.price,

      target:
        neckline -
        height,

      swings: [

        left,

        valley,

        right,

      ],

      trendLines: [],

      points: [

        {

          label: "Top1",

          swing: left,

        },

        {

          label: "Valley",

          swing: valley,

        },

        {

          label: "Top2",

          swing: right,

        },

      ],

    };

  }

  return null;

}

export function detectDoubleBottom(
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

    lows.length < 2 ||

    highs.length < 1

  ) {

    return null;

  }

  for (

    let i = 0;

    i < lows.length - 1;

    i++

  ) {

    const left =
      lows[i];

    const right =
      lows[i + 1];

    const diff = Math.abs(

      left.price -

      right.price

    );

    if (

      diff >

      left.price *
      PRICE_TOLERANCE

    ) {

      continue;

    }

    const peak =
      highs.find(

        h =>

          h.index > left.index &&

          h.index < right.index

      );

    if (!peak)
      continue;

    const neckline =
      peak.price;

    const height =

      neckline -

      left.price;

    return {

      pattern:
        "DOUBLE_BOTTOM",

      confidence: 82,

      breakout:
        neckline,

      stoploss:
        right.price,

      target:
        neckline +
        height,

      swings: [

        left,

        peak,

        right,

      ],

      trendLines: [],

      points: [

        {

          label: "Bottom1",

          swing: left,

        },

        {

          label: "Peak",

          swing: peak,

        },

        {

          label: "Bottom2",

          swing: right,

        },

      ],

    };

  }

  return null;

}
