import { analyzePattern } from "@/lib/pattern/patternEngine";

export function detectPatterns(candles:any[]) {
    if (!candles || candles.length === 0) return null;
    return analyzePattern(candles);
}

