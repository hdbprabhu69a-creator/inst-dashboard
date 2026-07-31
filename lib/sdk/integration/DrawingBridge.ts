import { PatternResult } from "@/lib/pattern/types";
import { buildPatternDrawing } from "@/lib/pattern/PatternDrawingFactory";

export function bridgePattern(
  result: PatternResult | null
) {

  if (!result)
    return null;

  return buildPatternDrawing(
    result
  );

}

