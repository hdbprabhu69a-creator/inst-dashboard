import { ROLLING_WINDOWS, type RollingWindow } from "./DeliveryTypes";

/** Daily OHLCV and delivery input required by {@link DeliveryQualityEngine}. */
export interface DeliveryQualityRecord {
  readonly date: string | Date;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly deliveryQty: number;
  readonly deliveryPercent: number;
}

/**
 * Quantitative delivery-quality measures for one trading day and rolling window.
 *
 * `deliveryEfficiency = deliveryQty / volume`; `deliveryDensity = deliveryQty /
 * (high - low)`; `deliveryIntensity = deliveryQty / rollingMean(deliveryQty)`;
 * `participationRatio = deliveryPercent / 100`; and relative measures divide the
 * current value by its prior rolling mean. All zero-denominator ratios are zero.
 * Expansion and contraction are the positive and negative parts of the previous-day
 * percentage change. Quality indices are unweighted products: delivery efficiency Ã—
 * delivery intensity, and relative volume Ã— price efficiency.
 *
 * `priceEfficiency = |close - open| / (high - low)`; acceptance is the close's
 * normalized location in its range; rejection is `1 - priceEfficiency`; alignment
 * is `(close - open) / range Ã— (deliveryPercent change / 100)`. Compression and
 * stability are `|mean| / (|mean| + populationStdDev)` for delivery quantity and
 * delivery percent respectively. Consistency is the dominant-direction share of
 * non-flat adjacent delivery-percent changes in the rolling window.
 */
export interface DeliveryQualityResult {
  readonly deliveryEfficiency: number;
  readonly deliveryDensity: number;
  readonly deliveryIntensity: number;
  readonly participationRatio: number;
  readonly relativeDelivery: number;
  readonly relativeVolume: number;
  readonly deliveryExpansion: number;
  readonly deliveryContraction: number;
  readonly volumeExpansion: number;
  readonly volumeContraction: number;
  readonly deliveryQualityIndex: number;
  readonly volumeQualityIndex: number;
  readonly priceEfficiency: number;
  readonly priceAcceptance: number;
  readonly priceRejection: number;
  readonly deliveryPriceAlignment: number;
  readonly deliveryCompression: number;
  readonly deliveryExpansionRate: number;
  readonly deliveryConsistency: number;
  readonly deliveryStability: number;
}

/** Results for all required windows on one trading day. */
export interface DeliveryQualityDailyResult {
  readonly date: string;
  readonly windows: Readonly<Record<RollingWindow, DeliveryQualityResult>>;
}

interface NormalizedQualityRecord extends Omit<DeliveryQualityRecord, "date"> { readonly date: string; readonly timestamp: number; }

/**
 * Computes descriptive delivery-quality metrics for every supplied day.
 *
 * Six independent bounded rolling states provide O(n) processing for fixed windows
 * (5, 10, 20, 50, 100, and 200). Dates are sorted but never filled, so holidays and
 * corporate-action gaps remain explicit gaps in the returned series.
 */
export class DeliveryQualityEngine {
  /** Calculates every quality metric for every trading day and required window. */
  calculate(records: readonly DeliveryQualityRecord[]): DeliveryQualityDailyResult[] {
    const normalized = records.map((record) => this.normalize(record)).sort((left, right) => left.timestamp - right.timestamp);
    const states = new Map<RollingWindow, RollingQualityState>(ROLLING_WINDOWS.map((window) => [window, new RollingQualityState(window)]));
    return normalized.map((record) => {
      const windows = {} as Record<RollingWindow, DeliveryQualityResult>;
      for (const window of ROLLING_WINDOWS) windows[window] = states.get(window)?.add(record) ?? this.emptyResult();
      return { date: record.date, windows };
    });
  }

  private normalize(record: DeliveryQualityRecord): NormalizedQualityRecord {
    const timestamp = record.date instanceof Date ? record.date.getTime() : Date.parse(record.date);
    const values = [record.open, record.high, record.low, record.close, record.volume, record.deliveryQty, record.deliveryPercent, timestamp];
    if (values.some((value) => !Number.isFinite(value)) || record.volume < 0 || record.deliveryQty < 0) throw new Error("Delivery quality records require finite values, valid dates, and non-negative volume and delivery quantity.");
    return { ...record, date: new Date(timestamp).toISOString().slice(0, 10), timestamp };
  }

  private emptyResult(): DeliveryQualityResult { return { deliveryEfficiency: 0, deliveryDensity: 0, deliveryIntensity: 0, participationRatio: 0, relativeDelivery: 0, relativeVolume: 0, deliveryExpansion: 0, deliveryContraction: 0, volumeExpansion: 0, volumeContraction: 0, deliveryQualityIndex: 0, volumeQualityIndex: 0, priceEfficiency: 0, priceAcceptance: 0.5, priceRejection: 0, deliveryPriceAlignment: 0, deliveryCompression: 1, deliveryExpansionRate: 0, deliveryConsistency: 1, deliveryStability: 1 }; }
}

/** Incremental aggregate state for a single bounded rolling quality window. */
class RollingQualityState {
  private readonly records: NormalizedQualityRecord[] = [];
  private deliveryQuantitySum = 0; private deliveryQuantitySquareSum = 0; private deliveryPercentSum = 0; private deliveryPercentSquareSum = 0; private volumeSum = 0;
  private risingCount = 0; private fallingCount = 0;

  constructor(private readonly window: RollingWindow) {}

  add(record: NormalizedQualityRecord): DeliveryQualityResult {
    const previous = this.records[this.records.length - 1];
    const priorDeliveryMean = this.records.length ? this.deliveryQuantitySum / this.records.length : 0;
    const priorVolumeMean = this.records.length ? this.volumeSum / this.records.length : 0;
    const deliveryExpansionRate = previous && previous.deliveryQty !== 0 ? (record.deliveryQty - previous.deliveryQty) / Math.abs(previous.deliveryQty) : 0;
    const volumeRate = previous && previous.volume !== 0 ? (record.volume - previous.volume) / Math.abs(previous.volume) : 0;
    if (previous) this.updateDirection(record.deliveryPercent - previous.deliveryPercent, 1);
    this.records.push(record); this.updateAggregates(record, 1);
    if (this.records.length > this.window) this.removeOldest();
    const count = this.records.length;
    const deliveryMean = this.deliveryQuantitySum / count; const deliveryDeviation = this.standardDeviation(this.deliveryQuantitySquareSum, deliveryMean, count);
    const percentMean = this.deliveryPercentSum / count; const percentDeviation = this.standardDeviation(this.deliveryPercentSquareSum, percentMean, count);
    const priceRange = record.high - record.low;
    const deliveryEfficiency = this.ratio(record.deliveryQty, record.volume);
    const priceEfficiency = priceRange === 0 ? 0 : Math.abs(record.close - record.open) / Math.abs(priceRange);
    const priceAcceptance = priceRange === 0 ? 0.5 : (record.close - record.low) / priceRange;
    const relativeDelivery = this.ratio(record.deliveryQty, priorDeliveryMean);
    const relativeVolume = this.ratio(record.volume, priorVolumeMean);
    const deliveryIntensity = this.ratio(record.deliveryQty, deliveryMean);
    const directionalTransitions = this.risingCount + this.fallingCount;
    return { deliveryEfficiency, deliveryDensity: priceRange === 0 ? 0 : record.deliveryQty / Math.abs(priceRange), deliveryIntensity, participationRatio: record.deliveryPercent / 100, relativeDelivery, relativeVolume, deliveryExpansion: Math.max(deliveryExpansionRate, 0), deliveryContraction: Math.max(-deliveryExpansionRate, 0), volumeExpansion: Math.max(volumeRate, 0), volumeContraction: Math.max(-volumeRate, 0), deliveryQualityIndex: deliveryEfficiency * deliveryIntensity, volumeQualityIndex: relativeVolume * priceEfficiency, priceEfficiency, priceAcceptance, priceRejection: 1 - priceEfficiency, deliveryPriceAlignment: priceRange === 0 || !previous ? 0 : ((record.close - record.open) / priceRange) * ((record.deliveryPercent - previous.deliveryPercent) / 100), deliveryCompression: this.stability(deliveryMean, deliveryDeviation), deliveryExpansionRate, deliveryConsistency: directionalTransitions === 0 ? 1 : Math.max(this.risingCount, this.fallingCount) / directionalTransitions, deliveryStability: this.stability(percentMean, percentDeviation) };
  }

  private removeOldest(): void { const removed = this.records.shift(); if (!removed) return; const next = this.records[0]; if (next) this.updateDirection(next.deliveryPercent - removed.deliveryPercent, -1); this.updateAggregates(removed, -1); }
  private updateAggregates(record: NormalizedQualityRecord, multiplier: 1 | -1): void { this.deliveryQuantitySum += record.deliveryQty * multiplier; this.deliveryQuantitySquareSum += record.deliveryQty ** 2 * multiplier; this.deliveryPercentSum += record.deliveryPercent * multiplier; this.deliveryPercentSquareSum += record.deliveryPercent ** 2 * multiplier; this.volumeSum += record.volume * multiplier; }
  private updateDirection(change: number, multiplier: 1 | -1): void { if (change > 0) this.risingCount += multiplier; else if (change < 0) this.fallingCount += multiplier; }
  private ratio(numerator: number, denominator: number): number { return denominator === 0 ? 0 : numerator / denominator; }
  private standardDeviation(squareSum: number, mean: number, count: number): number { return Math.sqrt(Math.max(0, squareSum / count - mean ** 2)); }
  private stability(mean: number, deviation: number): number { return mean === 0 && deviation === 0 ? 1 : Math.abs(mean) / (Math.abs(mean) + deviation); }
}

