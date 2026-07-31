import { Candle } from "../../repository/historyRepository";
import { SwingPoint } from "../../models/priceStructureTypes";

export function detectSwingLows(
  candles: Candle[],
  left:number = 2,
  right:number = 2
): SwingPoint[] {

  const swings: SwingPoint[] = [];

  for (let i = left; i < candles.length - right; i++) {

    const low = candles[i].low;

    let swing = true;

    for (let j = 1; j <= left; j++) {

      if (candles[i-j].low <= low) {

        swing = false;

        break;

      }

    }

    if (!swing) continue;

    for (let j = 1; j <= right; j++) {

      if (candles[i+j].low < low) {

        swing = false;

        break;

      }

    }

    if (!swing) continue;

    swings.push({

      index: i,

      date: candles[i].date,

      price: low,

      type: "LOW"

    });

  }

  return swings;

}

