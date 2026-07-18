import assert from "node:assert/strict";
import test from "node:test";
import { InstitutionalEvidenceEngine } from "./InstitutionalEvidenceEngine";
import { AccumulationRule, PersistenceRule, PriceRule, QualityRule, TrendRule, VolumeRule, type EvidenceRuleConfiguration } from "./InstitutionalEvidenceRules";
import type { InstitutionalEvidenceInput, InstitutionalEvidenceRule } from "./InstitutionalEvidenceTypes";

const config = (id: string): EvidenceRuleConfiguration => ({ id, name: `${id} evidence`, expectedValue: 0.5, comparison: "GREATER_THAN_OR_EQUAL", weight: 1 });
const rules = (): InstitutionalEvidenceRule[] => [new PersistenceRule(config("persistence"), "persistenceRatio"), new QualityRule(config("quality"), "deliveryEfficiency"), new VolumeRule(config("volume"), "relativeVolume"), new PriceRule(config("price"), "priceEfficiency"), new TrendRule(config("trend"), "trendStrength"), new AccumulationRule(config("accumulation"), "accumulationScore")];
const allValueInput = (value: number): InstitutionalEvidenceInput => ({ persistence: { persistenceRatio: value }, quality: { deliveryEfficiency: value, relativeVolume: value, priceEfficiency: value }, accumulation: { trendStrength: value, accumulationScore: value } });

test("reports all configured rules as passing with complete evidence", () => {
  const result = new InstitutionalEvidenceEngine(rules()).evaluate(allValueInput(1));
  assert.equal(result.passed, 6);
  assert.equal(result.failed, 0);
  assert.equal(result.total, 6);
  assert.equal(result.confidence, 100);
  assert.ok(result.evidence.every((item) => item.passed && item.reason.includes(">=")));
});

test("reports all configured rules as failing without changing completeness", () => {
  const result = new InstitutionalEvidenceEngine(rules()).evaluate(allValueInput(0));
  assert.equal(result.passed, 0);
  assert.equal(result.failed, 6);
  assert.equal(result.confidence, 100);
});

test("keeps mixed evidence individually explainable", () => {
  const result = new InstitutionalEvidenceEngine(rules()).evaluate({ persistence: { persistenceRatio: 1 }, quality: { deliveryEfficiency: 0, relativeVolume: 1, priceEfficiency: 0 }, accumulation: { trendStrength: 1, accumulationScore: 0 } });
  assert.equal(result.passed, 3);
  assert.equal(result.failed, 3);
  assert.equal(result.evidence[0].category, "DELIVERY");
  assert.equal(result.evidence[1].passed, false);
});

test("treats missing and null input as unknown completeness, not a failed criterion", () => {
  const result = new InstitutionalEvidenceEngine(rules()).evaluate({ persistence: null, quality: undefined, accumulation: null });
  assert.equal(result.passed, 0);
  assert.equal(result.failed, 0);
  assert.equal(result.confidence, 0);
  assert.ok(result.evidence.every((item) => Number.isNaN(item.currentValue) && item.confidence === 0 && item.reason.includes("unavailable")));
});

test("honors a configuration override and comparison choice", () => {
  const rule = new PersistenceRule({ id: "override", name: "override evidence", expectedValue: 0.25, comparison: "LESS_THAN", weight: 3 }, "persistenceRatio");
  const result = new InstitutionalEvidenceEngine([rule]).evaluate({ persistence: { persistenceRatio: 0.2 } });
  assert.equal(result.passed, 1);
  assert.equal(result.evidence[0].weight, 3);
  assert.equal(result.evidence[0].expectedValue, 0.25);
});

test("is deterministic across a large sequence of independent evaluations", () => {
  const engine = new InstitutionalEvidenceEngine(rules());
  const inputs = Array.from({ length: 10_000 }, (_, index) => allValueInput(index % 2));
  const results = inputs.map((input) => engine.evaluate(input));
  assert.equal(results.length, 10_000);
  assert.deepEqual(engine.evaluate(allValueInput(1)), engine.evaluate(allValueInput(1)));
  assert.equal(results[9_999].total, 6);
});
