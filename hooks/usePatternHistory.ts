"use client";

import { useMemo } from "react";
import { detectPatterns } from "@/lib/patternEngine/patternLoader";

export function usePatternHistory(candles:any[]) {
    return useMemo(() => detectPatterns(candles), [candles]);
}
