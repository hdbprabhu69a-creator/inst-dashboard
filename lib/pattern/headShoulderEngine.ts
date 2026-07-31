import {
  PatternResult,
  SwingPoint,
} from "./types";

export function detectHeadShoulder(
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
    highs.length < 3 ||
    lows.length < 2
  ) {
    return null;
  }

  for (
    let i = 0;
    i < highs.length - 2;
    i++
  ) {

    const left =
      highs[i];

    const head =
      highs[i + 1];

    const right =
      highs[i + 2];

    if (
      head.price <= left.price ||
      head.price <= right.price
    ) {
      continue;
    }

    const leftLow =
      lows.find(
        l =>
          l.index > left.index &&
          l.index < head.index
      );

    const rightLow =
      lows.find(
        l =>
          l.index > head.index &&
          l.index < right.index
      );

    if (
      !leftLow ||
      !rightLow
    ) {
      continue;
    }

    const neckline =

      (
        leftLow.price +
        rightLow.price
      ) / 2;

    const height =

      head.price -
      neckline;

    return {

      pattern:
        "HEAD_SHOULDER",

      confidence: 85,

      breakout:
        neckline,

      stoploss:
        right.price,

      target:
        neckline - height,

      swings: [

        left,
        leftLow,
        head,
        rightLow,
        right,

      ],

      trendLines: [],

      points: [

        {

          label: "LS",

          swing: left,

        },

        {

          label: "NL1",

          swing: leftLow,

        },

        {

          label: "H",

          swing: head,

        },

        {

          label: "NL2",

          swing: rightLow,

        },

        {

          label: "RS",

          swing: right,

        },

      ],

    };

  }

  return null;

}

export function detectInverseHeadShoulder(
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
    lows.length < 3
  ) {
    return null;
  }

  for (
    let i = 0;
    i < lows.length - 2;
    i++
  ) {

    const left =
      lows[i];

    const head =
      lows[i + 1];

    const right =
      lows[i + 2];

    if (
      head.price >= left.price ||
      head.price >= right.price
    ) {
      continue;
    }

    const leftHigh =
      highs.find(
        h =>
          h.index > left.index &&
          h.index < head.index
      );

    const rightHigh =
      highs.find(
        h =>
          h.index > head.index &&
          h.index < right.index
      );

    if (
      !leftHigh ||
      !rightHigh
    ) {
      continue;
    }

    const neckline =

      (
        leftHigh.price +
        rightHigh.price
      ) / 2;

    const height =

      neckline -
      head.price;

    return {

      pattern:
        "INVERSE_HEAD_SHOULDER",

      confidence: 85,

      breakout:
        neckline,

      stoploss:
        right.price,

      target:
        neckline + height,

      swings: [

        left,
        leftHigh,
        head,
        rightHigh,
        right,

      ],

      trendLines: [],

      points: [

        {

          label: "LS",

          swing: left,

        },

        {

          label: "NL1",

          swing: leftHigh,

        },

        {

          label: "H",

          swing: head,

        },

        {

          label: "NL2",

          swing: rightHigh,

        },

        {

          label: "RS",

          swing: right,

        },

      ],

    };

  }

  return null;

}
