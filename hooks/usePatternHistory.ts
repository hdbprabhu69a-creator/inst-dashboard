"use client";

import { useMemo } from "react";
import { analyzePattern } from "@/lib/pattern/patternEngine";

export function usePatternHistory(candles:any[]) {
    return useMemo(() => analyzePattern(candles), [candles]);
}


