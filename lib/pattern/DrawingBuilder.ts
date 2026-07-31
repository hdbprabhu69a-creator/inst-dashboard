import { PatternResult } from "./types";
import { PatternDrawing } from "@/lib/chart/render/PatternDrawing";

export class DrawingBuilder {

  static build(
    pattern: PatternResult
  ): PatternDrawing {

    return {

      pattern: pattern.pattern,

      confidence: pattern.confidence,

      lines: pattern.trendLines.map(t => ({

        from: {
          index: t.start.index,
          time: t.start.time,
          price: t.start.price,
        },

        to: {
          index: t.end.index,
          time: t.end.time,
          price: t.end.price,
        },

      })),

      targets: [
        pattern.target,
      ],

      stopLoss:
        pattern.stoploss,

    };

  }

}


