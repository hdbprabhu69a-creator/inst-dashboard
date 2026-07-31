import assert from "node:assert/strict";
import test from "node:test";
import { ConfiguredBehaviourRule, InstitutionalBehaviourEngine, type ConfiguredBehaviourRuleDefinition } from "./InstitutionalBehaviourEngine";
import type { InstitutionalEvidence, InstitutionalEvidenceCategory, InstitutionalEvidenceResult } from "./InstitutionalEvidenceTypes";

const categories: readonly InstitutionalEvidenceCategory[] = ["DELIVERY", "QUALITY", "VOLUME", "PRICE", "TREND", "ACCUMULATION"];
const evidence = (category: InstitutionalEvidenceCategory, passed = true, currentValue = 1): InstitutionalEvidence => ({ id: category.toLowerCase(), name: category, category, passed, confidence: Number.isFinite(currentValue) ? 100 : 0, reason: category, currentValue, expectedValue: 1, weight: 1 });
const result = (items: readonly InstitutionalEvidence[], confidence = 100): InstitutionalEvidenceResult => ({ evidence: items, passed: items.filter((item) => item.passed).length, failed: items.filter((item) => !item.passed && Number.isFinite(item.currentValue)).length, total: items.length, confidence });
const definition = (id: string, behaviour: ConfiguredBehaviourRuleDefinition["behaviour"], requirements: ConfiguredBehaviourRuleDefinition["requirements"]): ConfiguredBehaviourRuleDefinition => ({ id, behaviour, reason: `${behaviour} evidence combination`, requirements });
const requirement = (category: InstitutionalEvidenceCategory, status: "PASS" | "FAIL" | "UNKNOWN" = "PASS") => ({ category, status, match: "ALL" as const });

test("selects configured active behaviour when all evidence groups satisfy the declared rule", () => {
  const rule = new ConfiguredBehaviourRule(definition("active", "ACTIVE", categories.map((category) => requirement(category))));
  const behaviour = new InstitutionalBehaviourEngine({ rules: [rule] }).evaluate(result(categories.map((category) => evidence(category))));
  assert.equal(behaviour.behaviour, "ACTIVE");
  assert.equal(behaviour.confidence, 100);
  assert.equal(behaviour.satisfiedEvidence.length, 6);
  assert.equal(behaviour.missingEvidence.length, 0);
});

test("supports configured behaviour transitions without embedded examples", () => {
  const active = new ConfiguredBehaviourRule(definition("active", "ACTIVE", [requirement("DELIVERY"), requirement("QUALITY"), requirement("TREND")]));
  const building = new ConfiguredBehaviourRule(definition("building", "BUILDING", [requirement("DELIVERY"), requirement("QUALITY"), requirement("TREND", "FAIL")]));
  const engine = new InstitutionalBehaviourEngine({ rules: [active, building] });
  const state = engine.evaluate(result([evidence("DELIVERY"), evidence("QUALITY"), evidence("TREND", false)]));
  assert.equal(state.behaviour, "BUILDING");
  assert.equal(state.ruleId, "building");
});

test("returns unknown with partial and missing evidence", () => {
  const rule = new ConfiguredBehaviourRule(definition("active", "ACTIVE", [requirement("DELIVERY"), requirement("QUALITY"), requirement("VOLUME")]));
  const state = new InstitutionalBehaviourEngine({ rules: [rule] }).evaluate(result([evidence("DELIVERY"), evidence("QUALITY")], 80));
  assert.equal(state.behaviour, "UNKNOWN");
  assert.deepEqual(state.missingEvidence, ["VOLUME:PASS"]);
  assert.ok(Math.abs(state.confidence - 80 * 2 / 3) < 1e-12);
});

test("treats unknown evidence as incomplete rather than a failing behavioural claim", () => {
  const rule = new ConfiguredBehaviourRule(definition("strengthening", "STRENGTHENING", [requirement("DELIVERY"), requirement("QUALITY")]));
  const state = new InstitutionalBehaviourEngine({ rules: [rule] }).evaluate(result([evidence("DELIVERY"), evidence("QUALITY", false, Number.NaN)], 50));
  assert.equal(state.behaviour, "UNKNOWN");
  assert.deepEqual(state.missingEvidence, ["quality"]);
  assert.equal(state.confidence, 25);
});

test("honors complete configuration overrides and deterministic precedence", () => {
  const first = new ConfiguredBehaviourRule(definition("first", "WEAKENING", [requirement("DELIVERY")]));
  const second = new ConfiguredBehaviourRule(definition("second", "ACTIVE", [requirement("DELIVERY")]));
  const engine = new InstitutionalBehaviourEngine({ rules: [first, second] });
  const firstRun = engine.evaluate(result([evidence("DELIVERY")]));
  const secondRun = engine.evaluate(result([evidence("DELIVERY")]));
  assert.equal(firstRun.behaviour, "WEAKENING");
  assert.deepEqual(firstRun, secondRun);
});

test("evaluates large evidence sequences without accessing source-engine metrics", () => {
  const rule = new ConfiguredBehaviourRule(definition("building", "BUILDING", [requirement("DELIVERY"), requirement("QUALITY")]));
  const engine = new InstitutionalBehaviourEngine({ rules: [rule] });
  const inputs = Array.from({ length: 10_000 }, () => result([evidence("DELIVERY"), evidence("QUALITY")]));
  const states = inputs.map((input) => engine.evaluate(input));
  assert.equal(states.length, 10_000);
  assert.ok(states.every((state) => state.behaviour === "BUILDING"));
});

