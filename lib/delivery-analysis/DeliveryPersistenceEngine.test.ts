import assert from "node:assert/strict";
import test from "node:test";
import { DeliveryPersistenceEngine, type DeliveryPersistenceRecord } from "./DeliveryPersistenceEngine";

const record = (date: string, deliveryPercent: number, deliveryQty: number, volume = 100): DeliveryPersistenceRecord => ({ date, deliveryPercent, deliveryQty, volume });

test("calculates rising streaks, momentum, and acceleration without thresholds", () => {
  const result = new DeliveryPersistenceEngine().calculate([record("2025-01-01", 10, 10), record("2025-01-02", 20, 20), record("2025-01-03", 40, 40)]);
  const latest = result[2].windows[5];
  assert.equal(latest.consecutiveHighDays, 2);
  assert.equal(latest.risingDays, 2);
  assert.equal(latest.risingDeliveryQuantityDays, 2);
  assert.equal(latest.risingRelativeDeliveryDays, 2);
  assert.equal(latest.momentum, 25);
  assert.equal(latest.acceleration, 15);
  assert.equal(latest.persistenceRatio, 0.23333333333333334);
});

test("maintains bounded rolling statistics after a window fills", () => {
  const records = [10, 20, 30, 40, 50, 60].map((value, index) => record(`2025-01-0${index + 1}`, value, value));
  const latest = new DeliveryPersistenceEngine().calculate(records)[5].windows[5];
  assert.equal(latest.persistenceRatio, 0.4);
  assert.equal(latest.volatility, Math.sqrt(200));
  assert.equal(latest.risingDays, 5);
});

test("handles zero volume and rejects invalid records", () => {
  const zeroVolume = new DeliveryPersistenceEngine().calculate([record("2025-01-01", 0, 0, 0)])[0].windows[5];
  assert.equal(zeroVolume.persistenceRatio, 0);
  assert.equal(zeroVolume.stability, 1);
  assert.throws(() => new DeliveryPersistenceEngine().calculate([{ date: "invalid", deliveryPercent: 10, deliveryQty: 10, volume: 100 }]));
});
