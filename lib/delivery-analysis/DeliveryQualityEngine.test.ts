import assert from "node:assert/strict";
import test from "node:test";
import { DeliveryQualityEngine, type DeliveryQualityRecord } from "./DeliveryQualityEngine";

const record = (date: string | Date, deliveryQty: number, deliveryPercent: number, volume = 100): DeliveryQualityRecord => ({ date, open: 10, high: 20, low: 0, close: 15, volume, deliveryQty, deliveryPercent });

test("calculates documented quantitative quality formulas", () => {
  const result = new DeliveryQualityEngine().calculate([record("2025-01-01", 20, 20), record("2025-01-02", 40, 40, 200)]);
  const latest = result[1].windows[5];
  assert.equal(latest.deliveryEfficiency, 0.2);
  assert.equal(latest.deliveryDensity, 2);
  assert.equal(latest.deliveryIntensity, 4 / 3);
  assert.equal(latest.participationRatio, 0.4);
  assert.equal(latest.relativeDelivery, 2);
  assert.equal(latest.relativeVolume, 2);
  assert.equal(latest.deliveryExpansion, 1);
  assert.equal(latest.deliveryContraction, 0);
  assert.equal(latest.volumeExpansion, 1);
  assert.equal(latest.volumeContraction, 0);
  assert.equal(latest.priceEfficiency, 0.25);
  assert.equal(latest.priceAcceptance, 0.75);
  assert.equal(latest.priceRejection, 0.75);
  assert.equal(latest.deliveryPriceAlignment, 0.05);
});

test("handles zero volume and zero delivery with finite output", () => {
  const latest = new DeliveryQualityEngine().calculate([record("2025-01-01", 0, 0, 0)])[0].windows[5];
  for (const value of Object.values(latest)) assert.ok(Number.isFinite(value));
  assert.equal(latest.deliveryEfficiency, 0);
  assert.equal(latest.deliveryQualityIndex, 0);
  assert.equal(latest.deliveryStability, 1);
});

test("captures constant, increasing, and decreasing delivery sequences", () => {
  const engine = new DeliveryQualityEngine();
  const constant = engine.calculate([record("2025-01-01", 10, 10), record("2025-01-02", 10, 10), record("2025-01-03", 10, 10)])[2].windows[5];
  assert.equal(constant.deliveryConsistency, 1);
  assert.equal(constant.deliveryCompression, 1);
  assert.equal(constant.deliveryStability, 1);
  const decreasing = engine.calculate([record("2025-01-01", 30, 30), record("2025-01-02", 20, 20), record("2025-01-03", 10, 10)])[2].windows[5];
  assert.equal(decreasing.deliveryExpansion, 0);
  assert.equal(decreasing.deliveryContraction, 0.5);
  assert.equal(decreasing.deliveryConsistency, 1);
});

test("preserves missing trading days and corporate-action gaps", () => {
  const result = new DeliveryQualityEngine().calculate([record("2025-01-01", 10, 10), record("2025-01-03", 20, 20), record("2025-02-15", 30, 30)]);
  assert.deepEqual(result.map((item) => item.date), ["2025-01-01", "2025-01-03", "2025-02-15"]);
});

test("processes large datasets across every required window", () => {
  const records: DeliveryQualityRecord[] = Array.from({ length: 10_000 }, (_, index) => record(new Date(Date.UTC(2000, 0, index + 1)), (index % 200) + 1, index % 100, (index % 500) + 1));
  const result = new DeliveryQualityEngine().calculate(records);
  assert.equal(result.length, 10_000);
  assert.ok(Number.isFinite(result[9_999].windows[200].deliveryQualityIndex));
});

test("rejects incomplete or invalid daily data", () => {
  assert.throws(() => new DeliveryQualityEngine().calculate([{ ...record("2025-01-01", 10, 10), volume: Number.NaN }]));
  const incomplete = { date: "2025-01-02", open: 10, high: 20, low: 0, close: 15, volume: 100, deliveryQty: 10 };
  assert.throws(() => new DeliveryQualityEngine().calculate([incomplete as unknown as DeliveryQualityRecord]));
});

