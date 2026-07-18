import { ROLLING_WINDOWS, type RollingWindow } from "./DeliveryTypes";

/** Daily input required for mathematical delivery-persistence analysis. */
export interface DeliveryPersistenceRecord {
  readonly date: string | Date;
  readonly deliveryQty: number;
  readonly deliveryPercent: number;
  readonly volume: number;
}

/**
 * Mathematical persistence metrics for one date and one rolling window.
 *
 * `risingDays` is the consecutive rising delivery-percent count. The two
 * additional streaks expose the separately requested quantity and relative-delivery series.
 */
export interface DeliveryPersistenceResult {
  readonly consecutiveHighDays: number;
  readonly risingDays: number;
  readonly risingDeliveryQuantityDays: number;
  readonly risingRelativeDeliveryDays: number;
  readonly persistenceRatio: number;
  readonly consistency: number;
  readonly stability: number;
  readonly volatility: number;
  readonly momentum: number;
  readonly acceleration: number;
}

/** Results for every required rolling window on one trading date. */
export interface DeliveryPersistenceDailyResult {
  readonly date: string;
  readonly windows: Readonly<Record<RollingWindow, DeliveryPersistenceResult>>;
}

interface NormalizedPersistenceRecord {
  readonly date: string;
  readonly timestamp: number;
  readonly deliveryQty: number;
  readonly deliveryPercent: number;
  readonly volume: number;
  readonly relativeDelivery: number;
}

/**
 * Computes delivery-persistence measurements for each trading day in O(n) time
 * per fixed rolling window. It does not infer institutional intent or apply thresholds.
 *
 * Definitions: a high-delivery day is strictly above the prior rolling mean;
 * persistence is rolling delivery quantity divided by rolling volume; consistency
 * is the dominant direction share of non-flat daily delivery-percent changes;
 * stability is `|mean| / (|mean| + populationStdDev)`; and volatility is the
 * population standard deviation of delivery percent. Zero total volume contributes
 * a relative-delivery value of zero, avoiding a non-finite ratio.
 */
export class DeliveryPersistenceEngine {
  /** Calculates all required rolling-window results in chronological date order. */
  calculate(records: readonly DeliveryPersistenceRecord[]): DeliveryPersistenceDailyResult[] {
    const normalizedRecords = records.map((record) => this.normalize(record)).sort((left, right) => left.timestamp - right.timestamp);
    const states = new Map<RollingWindow, RollingPersistenceState>(ROLLING_WINDOWS.map((window) => [window, new RollingPersistenceState(window)]));
    return normalizedRecords.map((record) => {
      const windows = {} as Record<RollingWindow, DeliveryPersistenceResult>;
      for (const window of ROLLING_WINDOWS) windows[window] = states.get(window)?.add(record) ?? this.emptyResult();
      return { date: record.date, windows };
    });
  }

  private normalize(record: DeliveryPersistenceRecord): NormalizedPersistenceRecord {
    const timestamp = record.date instanceof Date ? record.date.getTime() : Date.parse(record.date);
    if (!Number.isFinite(timestamp) || !Number.isFinite(record.deliveryQty) || !Number.isFinite(record.deliveryPercent) || !Number.isFinite(record.volume) || record.deliveryQty < 0 || record.volume < 0) throw new Error("Delivery persistence records require valid non-negative quantities, volume, and a valid date.");
    return { date: new Date(timestamp).toISOString().slice(0, 10), timestamp, deliveryQty: record.deliveryQty, deliveryPercent: record.deliveryPercent, volume: record.volume, relativeDelivery: record.volume === 0 ? 0 : record.deliveryQty / record.volume };
  }

  private emptyResult(): DeliveryPersistenceResult { return { consecutiveHighDays: 0, risingDays: 0, risingDeliveryQuantityDays: 0, risingRelativeDeliveryDays: 0, persistenceRatio: 0, consistency: 1, stability: 1, volatility: 0, momentum: 0, acceleration: 0 }; }
}

/** Maintains one bounded rolling window using constant-time aggregate updates. */
class RollingPersistenceState {
  private readonly records: NormalizedPersistenceRecord[] = [];
  private deliveryPercentSum = 0; private deliveryPercentSquareSum = 0; private deliveryQuantitySum = 0; private volumeSum = 0;
  private risingCount = 0; private fallingCount = 0;
  private highStreak = 0; private percentStreak = 0; private quantityStreak = 0; private relativeStreak = 0; private previousMomentum = 0;

  constructor(private readonly window: RollingWindow) {}

  add(record: NormalizedPersistenceRecord): DeliveryPersistenceResult {
    const priorMean = this.records.length ? this.deliveryPercentSum / this.records.length : null;
    const previous = this.records[this.records.length - 1];
    const isHigh = priorMean !== null && record.deliveryPercent > priorMean;
    this.highStreak = isHigh ? Math.min(this.highStreak + 1, this.window) : 0;
    this.percentStreak = previous && record.deliveryPercent > previous.deliveryPercent ? Math.min(this.percentStreak + 1, this.window) : 0;
    this.quantityStreak = previous && record.deliveryQty > previous.deliveryQty ? Math.min(this.quantityStreak + 1, this.window) : 0;
    this.relativeStreak = previous && record.relativeDelivery > previous.relativeDelivery ? Math.min(this.relativeStreak + 1, this.window) : 0;
    if (previous) this.addDirection(record.deliveryPercent - previous.deliveryPercent, 1);
    this.records.push(record); this.addAggregates(record, 1);
    if (this.records.length > this.window) this.removeOldest();
    const count = this.records.length; const mean = this.deliveryPercentSum / count;
    const variance = Math.max(0, this.deliveryPercentSquareSum / count - mean * mean); const volatility = Math.sqrt(variance);
    const momentum = priorMean === null ? 0 : record.deliveryPercent - priorMean;
    const acceleration = priorMean === null ? 0 : momentum - this.previousMomentum;
    this.previousMomentum = momentum;
    const directionalTransitions = this.risingCount + this.fallingCount;
    return { consecutiveHighDays: this.highStreak, risingDays: this.percentStreak, risingDeliveryQuantityDays: this.quantityStreak, risingRelativeDeliveryDays: this.relativeStreak, persistenceRatio: this.volumeSum === 0 ? 0 : this.deliveryQuantitySum / this.volumeSum, consistency: directionalTransitions === 0 ? 1 : Math.max(this.risingCount, this.fallingCount) / directionalTransitions, stability: mean === 0 && volatility === 0 ? 1 : Math.abs(mean) / (Math.abs(mean) + volatility), volatility, momentum, acceleration };
  }

  private removeOldest(): void {
    const removed = this.records.shift();
    if (!removed) return;
    const newFirst = this.records[0];
    if (newFirst) this.addDirection(newFirst.deliveryPercent - removed.deliveryPercent, -1);
    this.addAggregates(removed, -1);
  }
  private addAggregates(record: NormalizedPersistenceRecord, multiplier: 1 | -1): void { this.deliveryPercentSum += record.deliveryPercent * multiplier; this.deliveryPercentSquareSum += record.deliveryPercent * record.deliveryPercent * multiplier; this.deliveryQuantitySum += record.deliveryQty * multiplier; this.volumeSum += record.volume * multiplier; }
  private addDirection(change: number, multiplier: 1 | -1): void { if (change > 0) this.risingCount += multiplier; else if (change < 0) this.fallingCount += multiplier; }
}
