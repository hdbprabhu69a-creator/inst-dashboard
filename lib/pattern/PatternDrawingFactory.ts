import { PatternResult } from "./types";
import { PatternDrawing } from "@/lib/chart/render/PatternDrawing";
import { DrawingBuilder } from "./DrawingBuilder";

export function buildPatternDrawing(
  pattern: PatternResult | null
): PatternDrawing | null {

  if (!pattern)
    return null;

  return DrawingBuilder.build(
    pattern
  );

}

