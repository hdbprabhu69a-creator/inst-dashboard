/** Small allocation-free primitives used by rolling calculations. */
export function median(values: readonly number[]): number | null { if (!values.length) return null; const sorted = [...values].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; }
export function standardDeviation(values: readonly number[], mean: number): number | null { if (!values.length) return null; let sum = 0; for (const value of values) sum += (value - mean) ** 2; return Math.sqrt(sum / values.length); }
export function percentileRank(value: number, values: readonly number[]): number | null { if (!values.length) return null; let belowOrEqual = 0; for (const candidate of values) if (candidate <= value) belowOrEqual++; return belowOrEqual / values.length; }
export function change(current: number, previous: number): number | null { return previous === 0 ? null : (current - previous) / Math.abs(previous); }

