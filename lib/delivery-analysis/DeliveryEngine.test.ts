import assert from "node:assert/strict";
import test from "node:test";
import { DeliveryEngine, type DeliveryRecord } from "./index";

const record = (date: string, volume = 100, deliveryQty = 40, deliveryPercent = 40): DeliveryRecord => ({ symbol: "test", date, open: 10, high: 12, low: 9, close: 11, volume, deliveryQty, deliveryPercent });

test("preserves holiday and corporate-action gaps without synthesizing records", () => {
  const result = new DeliveryEngine().analyze([record("2025-01-01"), record("2025-01-03"), record("2025-02-01", 200, 80, 40)]);
  assert.deepEqual(result.metrics.map((metric) => metric.date), ["2025-01-01", "2025-01-03", "2025-02-01"]);
  assert.equal(result.recordsAnalyzed, 3);
  assert.equal(result.detectorResults.length, 12);
});

test("handles zero delivery and zero volume without non-finite ratios", () => {
  const result = new DeliveryEngine().analyze([record("2025-01-01", 0, 0, 0), record("2025-01-02", 0, 0, 0)]);
  const latest = result.latestMetrics;
  assert.ok(latest);
  assert.equal(latest.deliveryGrowth, null);
  assert.equal(latest.relativeVolume, null);
  assert.equal(latest.volumeExpansion, null);
});

test("rejects invalid missing numeric data", () => {
  assert.throws(() => new DeliveryEngine().analyze([{ ...record("2025-01-01"), volume: Number.NaN }]));
  const incomplete = { symbol: "TEST", date: "2025-01-02", open: 10, high: 12, low: 9, close: 11, volume: 100, deliveryPercent: 40 };
  assert.throws(() => new DeliveryEngine().analyze([incomplete as unknown as DeliveryRecord]));
});

test("returns a reusable batch ranking even when scoring is intentionally unconfigured", () => {
  const engine = new DeliveryEngine();
  const batch = engine.analyzeMany(new Map([["AAA", [{ ...record("2025-01-01"), symbol: "AAA" }]], ["BBB", [{ ...record("2025-01-01"), symbol: "BBB" }]]]));
  assert.equal(batch.analyses.length, 2);
  assert.deepEqual(batch.ranking.map((entry) => entry.symbol), ["AAA", "BBB"]);
});

