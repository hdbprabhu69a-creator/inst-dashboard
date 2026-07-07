
lib\chart\CandlestickChart.tsx
Line 21
import { detectPatterns } from "@/lib/patterns/analyzePattern";

lib\chart\CandlestickChart.tsx
Line 22
import PatternOverlay from "@/lib/chart/PatternOverlay";

lib\chart\CandlestickChart.tsx
Line 23
import PatternInfoOverlay from "@/lib/chart/PatternInfoOverlay";

lib\chart\CandlestickChart.tsx
Line 24
import PatternLabels from "@/lib/chart/PatternLabels";

lib\chart\CandlestickChart.tsx
Line 481
const result = detectPatterns(cleanedCandlesRef.current);

lib\chart\CandlestickChart.tsx
Line 638
<PatternOverlay

lib\chart\CandlestickChart.tsx
Line 643
<PatternInfoOverlay

lib\chart\PatternInfoOverlay.tsx
Line 10
export default function PatternInfoOverlay({

lib\chart\PatternLabels.tsx
Line 21
export default function PatternLabels({

lib\chart\PatternOverlay.tsx
Line 89
export default function PatternOverlay({

lib\pattern\buildPatternLabels.ts
Line 16
export function buildPatternLabels(

lib\pattern\patternEngine.ts
Line 50
export function analyzePattern(

lib\patternEngine\patternLoader.ts
Line 1
import { analyzePattern } from "@/lib/pattern/patternEngine";

lib\patternEngine\patternLoader.ts
Line 3
export function detectPatterns(candles:any[]) {

lib\patternEngine\patternLoader.ts
Line 5
return analyzePattern(candles);

lib\patterns\analyzePattern.ts
Line 1
import { analyzePattern } from "@/lib/pattern/patternEngine";

lib\patterns\analyzePattern.ts
Line 3
export function detectPatterns(candles:any[]) {

lib\patterns\analyzePattern.ts
Line 5
return analyzePattern(candles);
