import {
  Candle,
  SwingPoint,
} from "./types";

const LOOKBACK = 2;

export function detectSwings(
  candles: Candle[]
): SwingPoint[] {

  const swings: SwingPoint[] = [];

  if (candles.length < 5)
    return swings;

  for (
    let i = LOOKBACK;
    i < candles.length - LOOKBACK;
    i++
  ) {

    const current =
      candles[i];

    let isHigh = true;

    let isLow = true;

    let strength = 0;

    for (
      let j = i - LOOKBACK;
      j <= i + LOOKBACK;
      j++
    ) {

      if (j === i)
        continue;

      if (
        candles[j].high >= current.high
      ) {

        isHigh = false;

      }

      if (
        candles[j].low <= current.low
      ) {

        isLow = false;

      }

      if (

        current.high >
          candles[j].high ||

        current.low <
          candles[j].low

      ) {

        strength++;

      }

    }

    if (isHigh) {

      swings.push({

        index: i,

        time: current.time,

        price: current.high,

        type: "HIGH",

        classification: "NONE",

        strength,

      });

    }

    if (isLow) {

      swings.push({

        index: i,

        time: current.time,

        price: current.low,

        type: "LOW",

        classification: "NONE",

        strength,

      });

    }

  }

  return classifySwings(
    swings
  );

}

export function classifySwings(
  swings: SwingPoint[]
): SwingPoint[] {

  let previousHigh:
    SwingPoint | undefined;

  let previousLow:
    SwingPoint | undefined;

  return swings.map(
    swing => {

      if (
        swing.type === "HIGH"
      ) {

        if (
          previousHigh
        ) {

          swing.classification =

            swing.price >
            previousHigh.price

              ? "HH"

              : "LH";

        }

        previousHigh =
          swing;

      }

      if (
        swing.type === "LOW"
      ) {

        if (
          previousLow
        ) {

          swing.classification =

            swing.price >
            previousLow.price

              ? "HL"

              : "LL";

        }

        previousLow =
          swing;

      }

      return swing;

    }
  );

}

export function getHighSwings(
  swings: SwingPoint[]
) {

  return swings.filter(

    s =>

      s.type === "HIGH"

  );

}

export function getLowSwings(
  swings: SwingPoint[]
) {

  return swings.filter(

    s =>

      s.type === "LOW"

  );

}

export function getStrongSwings(
  swings: SwingPoint[],
  minStrength = 3
) {

  return swings.filter(

    s =>

      s.strength >=
      minStrength

  );

}

