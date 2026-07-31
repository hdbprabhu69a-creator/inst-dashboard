import assert from "node:assert/strict";
import test from "node:test";
import { InstitutionalAccumulationEngine, type InstitutionalAccumulationInput } from "./InstitutionalAccumulationEngine";
import type { DeliveryPersistenceResult } from "./DeliveryPersistenceEngine";
import type { DeliveryQualityResult } from "./DeliveryQualityEngine";

const persistence = (value: number): Partial<DeliveryPersistenceResult> => ({ persistenceRatio: value, consistency: value, stability: value, momentum: value, acceleration: value, consecutiveHighDays: value, risingDays: value });
const quality = (value: number): Partial<DeliveryQualityResult> => ({ deliveryEfficiency: value, deliveryQualityIndex: value, relativeDelivery: value, relativeVolume: value, volumeExpansion: value, volumeQualityIndex: value, priceEfficiency: value, priceAcceptance: value, deliveryPriceAlignment: value, deliveryCompression: value, deliveryStability: value });
const input = (value: number, previousValue = 0): InstitutionalAccumulationInput => ({ persistence: persistence(value), quality: quality(value), previousPersistence: persistence(previousValue), previousQuality: quality(previousValue) });

test("returns zero strength for zero mathematical inputs", () => {
  const result = new InstitutionalAccumulationEngine().calculate(input(0));
  assert.equal(result.accumulationScore, 0);
  assert.equal(result.classification, "NONE");
  assert.equal(result.confidence, 100);
});

test("is deterministic for constant values and exposes every intermediate input", () => {
  const engine = new InstitutionalAccumulationEngine();
  const first = engine.calculate(input(0.5, 0.5));
  const second = engine.calculate(input(0.5, 0.5));
  assert.deepEqual(first, second);
  assert.equal(first.breakdown.expectedInputCount, 18);
  assert.equal(first.breakdown.availableInputCount, 18);
  assert.equal(first.trendStrength, 0);
});

test("increasing inputs quantify more accumulation than weak inputs", () => {
  const engine = new InstitutionalAccumulationEngine();
  const weak = engine.calculate(input(0.05, 0));
  const increasing = engine.calculate(input(100, 0));
  assert.ok(increasing.accumulationScore > weak.accumulationScore);
  assert.equal(increasing.classification, "VERY_STRONG");
  assert.ok(weak.accumulationScore < 20);
});

test("applies an explicit weight override without hidden weights", () => {
  const result = new InstitutionalAccumulationEngine({ delivery: 1, volume: 0, price: 0, trend: 0 }).calculate(input(0.5, 0));
  assert.equal(result.accumulationScore, result.deliveryStrength);
});

test("handles missing mathematical values as zero and reports input completeness", () => {
  const result = new InstitutionalAccumulationEngine().calculate({ persistence: { persistenceRatio: 0.5 }, quality: null });
  assert.equal(result.confidence, 100 / 18);
  assert.equal(result.breakdown.availableInputCount, 1);
  assert.ok(Number.isFinite(result.accumulationScore));
});

test("processes large input series in linear time", () => {
  const inputs = Array.from({ length: 10_000 }, (_, index) => input((index % 100) / 100, ((index + 99) % 100) / 100));
  const results = new InstitutionalAccumulationEngine().calculateSeries(inputs);
  assert.equal(results.length, 10_000);
  assert.ok(Number.isFinite(results[9_999].accumulationScore));
});

test("rejects invalid composite weights", () => {
  assert.throws(() => new InstitutionalAccumulationEngine({ delivery: 0, volume: 0, price: 0, trend: 0 }));
  assert.throws(() => new InstitutionalAccumulationEngine({ delivery: -1, volume: 1, price: 0, trend: 0 }));
});

