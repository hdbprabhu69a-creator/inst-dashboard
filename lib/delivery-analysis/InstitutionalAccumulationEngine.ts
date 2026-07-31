import type { DeliveryPersistenceResult } from "./DeliveryPersistenceEngine";
import type { DeliveryQualityResult } from "./DeliveryQualityEngine";

/** Configurable component weights used to form the final accumulation score. */
export interface AccumulationWeights { readonly delivery: number; readonly volume: number; readonly price: number; readonly trend: number; }

/** Inputs are precomputed mathematical outputs; previous values are optional for trend deltas. */
export interface InstitutionalAccumulationInput {
  readonly persistence?: Partial<DeliveryPersistenceResult> | null;
  readonly quality?: Partial<DeliveryQualityResult> | null;
  readonly previousPersistence?: Partial<DeliveryPersistenceResult> | null;
  readonly previousQuality?: Partial<DeliveryQualityResult> | null;
}

/** Fully exposed normalized inputs and mathematically derived trend values. */
export interface AccumulationBreakdown {
  readonly persistence: number; readonly consistency: number; readonly stability: number; readonly momentum: number; readonly acceleration: number; readonly relativeDelivery: number; readonly consecutiveHighDelivery: number; readonly risingDeliveryDays: number; readonly deliveryEfficiency: number; readonly deliveryQuality: number; readonly deliveryCompression: number; readonly qualityDeliveryStability: number;
  readonly relativeVolume: number; readonly volumeExpansion: number; readonly volumeQuality: number;
  readonly priceEfficiency: number; readonly priceAcceptance: number; readonly deliveryPriceAlignment: number;
  readonly persistenceTrend: number; readonly qualityTrend: number; readonly volumeTrend: number;
  readonly availableInputCount: number; readonly expectedInputCount: number;
}

/** Deterministic institutional-accumulation quantification result with no trading action. */
export interface InstitutionalAccumulationResult {
  readonly accumulationScore: number;
  readonly deliveryStrength: number;
  readonly volumeStrength: number;
  readonly priceStrength: number;
  readonly trendStrength: number;
  /** Percentage of the eighteen current mathematical inputs that were supplied as finite values. */
  readonly confidence: number;
  readonly classification: "NONE" | "VERY_WEAK" | "EARLY" | "MODERATE" | "STRONG" | "VERY_STRONG";
  /** Exposes all normalized values contributing to the four component strengths. */
  readonly breakdown: AccumulationBreakdown;
}

const DEFAULT_WEIGHTS: Readonly<AccumulationWeights> = Object.freeze({ delivery: 0.4, volume: 0.25, price: 0.2, trend: 0.15 });
const EXPECTED_INPUT_COUNT = 18;

/**
 * Quantifies accumulation from already-computed persistence and quality results.
 *
 * Bounded [0,1] inputs are multiplied by 100. Non-negative unbounded inputs use
 * `100x/(1+x)`. Directional inputs use `100max(0,x)/(1+max(0,x))`, so only a
 * positive mathematical change increases an accumulation-strength component. Each component is the
 * unweighted arithmetic mean of its documented normalized inputs. Trends are signed
 * differences between current and previous persistence ratio, delivery quality index,
 * and relative volume. The composite is the normalized weighted mean of its four
 * component strengths. These transforms contain no inferred market thresholds.
 */
export class InstitutionalAccumulationEngine {
  private readonly weights: AccumulationWeights;

  /** Creates an engine using the stated defaults or a complete non-negative weight override. */
  constructor(weights: AccumulationWeights = DEFAULT_WEIGHTS) {
    const values = [weights.delivery, weights.volume, weights.price, weights.trend];
    if (values.some((value) => !Number.isFinite(value) || value < 0) || values.every((value) => value === 0)) throw new Error("Accumulation weights must be finite, non-negative, and have a positive total.");
    this.weights = { ...weights };
  }

  /** Calculates a result from one current persistence/quality pair and optional prior pair. */
  calculate(input: InstitutionalAccumulationInput): InstitutionalAccumulationResult {
    const persistence = input.persistence; const quality = input.quality;
    const normalized = {
      persistence: this.unit(this.value(persistence?.persistenceRatio)), consistency: this.unit(this.value(persistence?.consistency)), stability: this.unit(this.value(persistence?.stability)), momentum: this.directional(this.value(persistence?.momentum)), acceleration: this.directional(this.value(persistence?.acceleration)), relativeDelivery: this.nonNegative(this.value(quality?.relativeDelivery)), consecutiveHighDelivery: this.nonNegative(this.value(persistence?.consecutiveHighDays)), risingDeliveryDays: this.nonNegative(this.value(persistence?.risingDays)), deliveryEfficiency: this.unit(this.value(quality?.deliveryEfficiency)), deliveryQuality: this.nonNegative(this.value(quality?.deliveryQualityIndex)), deliveryCompression: this.unit(this.value(quality?.deliveryCompression)), qualityDeliveryStability: this.unit(this.value(quality?.deliveryStability)),
      relativeVolume: this.nonNegative(this.value(quality?.relativeVolume)), volumeExpansion: this.nonNegative(this.value(quality?.volumeExpansion)), volumeQuality: this.nonNegative(this.value(quality?.volumeQualityIndex)),
      priceEfficiency: this.unit(this.value(quality?.priceEfficiency)), priceAcceptance: this.unit(this.value(quality?.priceAcceptance)), deliveryPriceAlignment: this.directional(this.value(quality?.deliveryPriceAlignment)),
      persistenceTrend: this.directional(this.value(persistence?.persistenceRatio) - this.value(input.previousPersistence?.persistenceRatio)), qualityTrend: this.directional(this.value(quality?.deliveryQualityIndex) - this.value(input.previousQuality?.deliveryQualityIndex)), volumeTrend: this.directional(this.value(quality?.relativeVolume) - this.value(input.previousQuality?.relativeVolume)),
    };
    const deliveryStrength = this.average([normalized.persistence, normalized.consistency, normalized.stability, normalized.momentum, normalized.acceleration, normalized.relativeDelivery, normalized.consecutiveHighDelivery, normalized.risingDeliveryDays, normalized.deliveryEfficiency, normalized.deliveryQuality, normalized.deliveryCompression, normalized.qualityDeliveryStability]);
    const volumeStrength = this.average([normalized.relativeVolume, normalized.volumeExpansion, normalized.volumeQuality]);
    const priceStrength = this.average([normalized.priceEfficiency, normalized.priceAcceptance, normalized.deliveryPriceAlignment]);
    const trendStrength = this.average([normalized.persistenceTrend, normalized.qualityTrend, normalized.volumeTrend]);
    const weightTotal = this.weights.delivery + this.weights.volume + this.weights.price + this.weights.trend;
    const accumulationScore = (deliveryStrength * this.weights.delivery + volumeStrength * this.weights.volume + priceStrength * this.weights.price + trendStrength * this.weights.trend) / weightTotal;
    const availableInputCount = this.countAvailable([persistence?.persistenceRatio, persistence?.consistency, persistence?.stability, persistence?.momentum, persistence?.acceleration, persistence?.consecutiveHighDays, persistence?.risingDays, quality?.relativeDelivery, quality?.deliveryEfficiency, quality?.deliveryQualityIndex, quality?.deliveryCompression, quality?.deliveryStability, quality?.relativeVolume, quality?.volumeExpansion, quality?.volumeQualityIndex, quality?.priceEfficiency, quality?.priceAcceptance, quality?.deliveryPriceAlignment]);
    return { accumulationScore, deliveryStrength, volumeStrength, priceStrength, trendStrength, confidence: availableInputCount / EXPECTED_INPUT_COUNT * 100, classification: this.classify(accumulationScore), breakdown: { ...normalized, availableInputCount, expectedInputCount: EXPECTED_INPUT_COUNT } };
  }

  /** Calculates an independent deterministic result for each supplied input in O(n) time. */
  calculateSeries(inputs: readonly InstitutionalAccumulationInput[]): InstitutionalAccumulationResult[] { return inputs.map((input) => this.calculate(input)); }

  private value(value: number | null | undefined): number { return typeof value === "number" && Number.isFinite(value) ? value : 0; }
  private unit(value: number): number { return Math.max(0, Math.min(1, value)) * 100; }
  private nonNegative(value: number): number { const nonNegativeValue = Math.max(0, value); return 100 * nonNegativeValue / (1 + nonNegativeValue); }
  private directional(value: number): number { return this.nonNegative(Math.max(0, value)); }
  private average(values: readonly number[]): number { return values.reduce((sum, value) => sum + value, 0) / values.length; }
  private countAvailable(values: readonly (number | null | undefined)[]): number { return values.filter((value) => typeof value === "number" && Number.isFinite(value)).length; }
  private classify(score: number): InstitutionalAccumulationResult["classification"] { if (score <= 20) return "NONE"; if (score <= 40) return "VERY_WEAK"; if (score <= 60) return "EARLY"; if (score <= 75) return "MODERATE"; if (score <= 90) return "STRONG"; return "VERY_STRONG"; }
}

