import { useMemo } from "react";
import { PatternResult } from "@/lib/pattern/types";
import { buildRenderPlan } from "./buildRenderPlan";

export function useRenderPlan(pattern: PatternResult | null) {

  return useMemo(() => {

    if (!pattern) return null;

    return buildRenderPlan(pattern);

  }, [pattern]);

}

