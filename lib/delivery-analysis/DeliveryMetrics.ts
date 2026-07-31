import { change, median, percentileRank, standardDeviation } from "./helpers/statistics";
import type { DeliveryMetricStrategy, DeliveryMetricsSnapshot, NormalizedDeliveryRecord, RollingStatistics, RollingWindow } from "./DeliveryTypes";

/** Produces descriptive delivery metrics; institutional interpretation is delegated to strategies. */
export class DeliveryMetricsCalculator {
  constructor(private readonly strategies: readonly DeliveryMetricStrategy[] = []) {}
  calculate(records: readonly NormalizedDeliveryRecord[], windows: readonly RollingWindow[]): DeliveryMetricsSnapshot[] {
    const percentileIndex = new DeliveryPercentileIndex(records.map((record) => record.deliveryPercent));
    return records.map((record, index) => {
      percentileIndex.add(record.deliveryPercent);
      const rolling = Object.fromEntries(windows.map((window) => [window, this.statistics(records.slice(Math.max(0, index + 1 - window), index + 1).map((item) => item.deliveryPercent), record.deliveryPercent)])) as Record<RollingWindow, RollingStatistics>;
      const previous = records[index - 1]; const prior = records[index - 2]; const currentGrowth = previous ? change(record.deliveryQty, previous.deliveryQty) : null;
      const previousGrowth = previous && prior ? change(previous.deliveryQty, prior.deliveryQty) : null;
      const base: DeliveryMetricsSnapshot = { date: record.date, dailyDeliveryPercent: record.deliveryPercent, deliveryQuantity: record.deliveryQty, deliveryGrowth: currentGrowth, deliveryMomentum: previous ? record.deliveryPercent - previous.deliveryPercent : null, deliveryAcceleration: currentGrowth !== null && previousGrowth !== null ? currentGrowth - previousGrowth : null, deliveryPersistence: null, deliveryStability: null, deliveryVolatility: rolling[windows[0]]?.stdDev ?? null, relativeVolume: null, volumeExpansion: null, priceEfficiency: null, priceVsDelivery: null, historicalPercentile: percentileIndex.percentile(record.deliveryPercent), rolling };
      return this.strategies.reduce<DeliveryMetricsSnapshot>((snapshot, strategy) => ({ ...snapshot, ...strategy.calculate(record, index, records, rolling) }), base);
    });
  }
  private statistics(values: readonly number[], current: number): RollingStatistics { const sampleSize = values.length; if (!sampleSize) return { mean: null, median: null, stdDev: null, zScore: null, percentile: null, sampleSize }; const mean = values.reduce((sum, value) => sum + value, 0) / sampleSize; const stdDev = standardDeviation(values, mean); return { mean, median: median(values), stdDev, zScore: stdDev && stdDev !== 0 ? (current - mean) / stdDev : null, percentile: percentileRank(current, values), sampleSize }; }
}

/** Coordinate-compressed online percentile tracker: O(log n) per observation. */
class DeliveryPercentileIndex {
  private readonly values: number[]; private readonly tree: number[]; private count = 0;
  constructor(values: readonly number[]) { this.values = [...new Set(values)].sort((a, b) => a - b); this.tree = new Array(this.values.length + 1).fill(0); }
  add(value: number): void { let index = this.indexOf(value) + 1; this.count++; while (index < this.tree.length) { this.tree[index]++; index += index & -index; } }
  percentile(value: number): number | null { if (!this.count) return null; let index = this.indexOf(value) + 1; let total = 0; while (index > 0) { total += this.tree[index]; index -= index & -index; } return total / this.count; }
  private indexOf(value: number): number { let low = 0; let high = this.values.length - 1; while (low <= high) { const middle = Math.floor((low + high) / 2); const candidate = this.values[middle]; if (candidate === value) return middle; if (candidate < value) low = middle + 1; else high = middle - 1; } throw new Error("Percentile index contains an unexpected value."); }
}

