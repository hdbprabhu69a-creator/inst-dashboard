import { Candle } from "../../repository/historyRepository";
import { SwingPoint } from "../../models/priceStructureTypes";

export function detectSwingHighs(
  candles: Candle[],
  left: number = 2,
  right: number = 2
): SwingPoint[] {

  const swings: SwingPoint[] = [];

  for (let i = left; i < candles.length - right; i++) {

    const high = candles[i].high;

    let isSwing = true;

    for (let j = 1; j <= left; j++) {
      if (candles[i-j].high >= high) {
        isSwing = false;
        break;
      }
    }

    if (!isSwing) continue;

    for (let j = 1; j <= right; j++) {
      if (candles[i+j].high > high) {
        isSwing = false;
        break;
      }
    }

    if (!isSwing) continue;

    swings.push({
      index: i,
      date: candles[i].date,
      price: high,
      type: "HIGH"
    });

  }

  return swings;

}

