import type { InstitutionalEvidence, InstitutionalEvidenceInput, InstitutionalEvidenceResult, InstitutionalEvidenceRule } from "./InstitutionalEvidenceTypes";

/**
 * Evaluates configured rules against existing engine output without recalculating it.
 * Aggregate confidence is solely the percentage of rules with finite source values.
 */
export class InstitutionalEvidenceEngine {
  /** Creates an evidence evaluator for the exact supplied rule set; no rules are implicit. */
  constructor(private readonly rules: readonly InstitutionalEvidenceRule[]) {}

  /** Evaluates every configured rule and returns explainable evidence plus completeness counts. */
  evaluate(input: InstitutionalEvidenceInput): InstitutionalEvidenceResult {
    const evidence = this.rules.map((rule) => this.toEvidence(rule, input));
    const passed = evidence.filter((item) => item.passed).length;
    const failed = evidence.filter((item) => !item.passed && Number.isFinite(item.currentValue)).length;
    const complete = passed + failed;
    return { evidence, passed, failed, total: evidence.length, confidence: evidence.length === 0 ? 0 : complete / evidence.length * 100 };
  }

  private toEvidence(rule: InstitutionalEvidenceRule, input: InstitutionalEvidenceInput): InstitutionalEvidence {
    const evaluation = rule.evaluate(input);
    return { id: rule.id, name: rule.name, category: rule.category, passed: evaluation.status === "PASS", confidence: evaluation.status === "UNKNOWN" ? 0 : 100, reason: evaluation.reason, currentValue: evaluation.currentValue, expectedValue: rule.expectedValue, weight: rule.weight };
  }
}

