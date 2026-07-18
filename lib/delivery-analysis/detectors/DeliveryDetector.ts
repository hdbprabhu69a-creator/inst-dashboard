import type { DetectorContext, DetectorName, DetectorResult, DetectorRule } from "../DeliveryTypes";

/** Base detector that remains inactive until its externally validated rule is supplied. */
export abstract class DeliveryDetector implements DetectorRule {
  abstract readonly name: DetectorName;
  constructor(private readonly rule?: DetectorRule) {}
  evaluate(context: DetectorContext): DetectorResult {
    return this.rule?.evaluate(context) ?? { detector: this.name, detected: false, configured: false, rationale: `TODO: configure an institutional rule for ${this.name}.` };
  }
}
