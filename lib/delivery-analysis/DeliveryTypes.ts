/** Raw daily NSE delivery input. Date-only ISO strings are recommended. */
export interface DeliveryRecord {
  readonly symbol: string;
  readonly date: string | Date;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly deliveryQty: number;
  readonly deliveryPercent: number;
}

/** Validated, chronologically ordered record used by the engine. */
export interface NormalizedDeliveryRecord extends Omit<DeliveryRecord, "date"> {
  readonly date: string;
  readonly timestamp: number;
}

export const ROLLING_WINDOWS = [5, 10, 20, 50, 100, 200] as const;
export type RollingWindow = (typeof ROLLING_WINDOWS)[number];
export type TrendClassification = "VERY_WEAK" | "WEAK" | "IMPROVING" | "NEUTRAL" | "STRONG" | "VERY_STRONG" | "INSTITUTIONAL";
export type DeliverySignal = "BUY_ZONE" | "ACCUMULATION" | "WATCH" | "NEUTRAL" | "DISTRIBUTION" | "EXIT" | "AVOID";
export type DetectorName = "ACCUMULATION" | "DISTRIBUTION" | "ABSORPTION" | "SUPPLY_EXHAUSTION" | "DEMAND_EXHAUSTION" | "SHAKEOUT" | "MARK_UP" | "MARK_DOWN" | "FALSE_BREAKOUT" | "FALSE_BREAKDOWN" | "SMART_MONEY_ENTRY" | "SMART_MONEY_EXIT";
export type ScoreName = "composite" | "institutional" | "trend" | "confidence";

export interface RollingStatistics { readonly mean: number | null; readonly median: number | null; readonly stdDev: number | null; readonly zScore: number | null; readonly percentile: number | null; readonly sampleSize: number; }
export interface DeliveryMetricsSnapshot {
  readonly date: string;
  readonly dailyDeliveryPercent: number | null;
  readonly deliveryQuantity: number | null;
  readonly deliveryGrowth: number | null;
  readonly deliveryMomentum: number | null;
  readonly deliveryAcceleration: number | null;
  /** Requires a domain strategy; no institutional persistence formula is assumed. */
  readonly deliveryPersistence: number | null;
  /** Requires a domain strategy; no institutional stability formula is assumed. */
  readonly deliveryStability: number | null;
  readonly deliveryVolatility: number | null;
  readonly relativeVolume: number | null;
  readonly volumeExpansion: number | null;
  /** Requires a domain strategy; no price-impact formula is assumed. */
  readonly priceEfficiency: number | null;
  /** Requires a domain strategy; no price/delivery interpretation is assumed. */
  readonly priceVsDelivery: number | null;
  readonly historicalPercentile: number | null;
  readonly rolling: Readonly<Record<RollingWindow, RollingStatistics>>;
}

export interface ScoreResult { readonly name: ScoreName; readonly value: number | null; readonly configured: boolean; readonly rationale: string; }
export interface DetectorResult { readonly detector: DetectorName; readonly detected: boolean; readonly configured: boolean; readonly rationale: string; readonly metadata?: Readonly<Record<string, number | string | boolean | null>>; }
export interface SignalResult {
  readonly accumulation: boolean;
  readonly distribution: boolean;
  readonly absorption: boolean;
  readonly smartMoneyEntry: boolean;
  readonly smartMoneyExit: boolean; readonly signal: DeliverySignal; readonly configured: boolean; readonly rationale: string; }
export interface TrendResult { readonly classification: TrendClassification; readonly configured: boolean; readonly rationale: string; }
export interface AnalysisResult { readonly symbol: string; readonly recordsAnalyzed: number; readonly metrics: readonly DeliveryMetricsSnapshot[]; readonly latestMetrics: DeliveryMetricsSnapshot | null; readonly scores: Readonly<Record<ScoreName, ScoreResult>>; readonly signals: SignalResult; readonly trend: TrendResult; readonly confidence: ScoreResult; readonly detectorResults: readonly DetectorResult[]; }
export interface RankingEntry { readonly symbol: string; readonly rank: number; readonly score: number | null; readonly result: AnalysisResult; }
/** Analysis and ranking output for a collection of symbols. */
export interface DeliveryAnalysisBatchResult { readonly analyses: readonly AnalysisResult[]; readonly ranking: readonly RankingEntry[]; }

/** Pluggable interpretation for metrics whose institutional meaning is intentionally unspecified. */
export interface DeliveryMetricStrategy { readonly name: string; calculate(record: NormalizedDeliveryRecord, index: number, records: readonly NormalizedDeliveryRecord[], rolling: Readonly<Record<RollingWindow, RollingStatistics>>): Partial<Pick<DeliveryMetricsSnapshot, "deliveryPersistence" | "deliveryStability" | "relativeVolume" | "volumeExpansion" | "priceEfficiency" | "priceVsDelivery">>; }
export interface ScoringStrategy { readonly name: ScoreName; score(result: Omit<AnalysisResult, "scores" | "signals" | "trend" | "confidence" | "detectorResults">): ScoreResult; }
export interface TrendStrategy { classify(metrics: DeliveryMetricsSnapshot | null): TrendResult; }
export interface SignalStrategy { signal(metrics: DeliveryMetricsSnapshot | null, detectors: readonly DetectorResult[]): SignalResult; }
export interface DetectorRule { evaluate(context: DetectorContext): DetectorResult; }
export interface DetectorContext { readonly symbol: string; readonly records: readonly NormalizedDeliveryRecord[]; readonly metrics: readonly DeliveryMetricsSnapshot[]; readonly latestMetrics: DeliveryMetricsSnapshot | null; }
export interface DeliveryEngineOptions { readonly metricStrategies?: readonly DeliveryMetricStrategy[]; readonly scoringStrategies?: readonly ScoringStrategy[]; readonly trendStrategy?: TrendStrategy; readonly signalStrategy?: SignalStrategy; readonly detectorRules?: readonly DetectorRule[]; }


