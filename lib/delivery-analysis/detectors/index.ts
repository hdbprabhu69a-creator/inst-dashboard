import type { DetectorName, DetectorRule } from "../DeliveryTypes";
import { DeliveryDetector } from "./DeliveryDetector";
import { AccumulationRule } from "./AccumulationRule";
import { DistributionRule } from "./DistributionRule";
import { AbsorptionRule } from "./AbsorptionRule";
import { SupplyExhaustionRule } from "./SupplyExhaustionRule";
import { DemandExhaustionRule } from "./DemandExhaustionRule";
import { ShakeoutRule } from "./ShakeoutRule";
import { SmartMoneyEntryRule } from "./SmartMoneyEntryRule";
import { SmartMoneyExitRule } from "./SmartMoneyExitRule";
import { MarkUpRule } from "./MarkUpRule";
import { MarkDownRule } from "./MarkDownRule";
import { FalseBreakoutRule } from "./FalseBreakoutRule";
import { FalseBreakdownRule } from "./FalseBreakdownRule";

/** Detector classes are intentionally rule-only: they define no market thresholds. */
class NamedDetector extends DeliveryDetector { constructor(readonly name: DetectorName, rule?: DetectorRule) { super(rule); } }
/** Configurable accumulation detector. */ export class AccumulationDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("ACCUMULATION", rule); } }
/** Configurable distribution detector. */ export class DistributionDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("DISTRIBUTION", rule); } }
/** Configurable absorption detector. */ export class AbsorptionDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("ABSORPTION", rule); } }
/** Configurable supply-exhaustion detector. */ export class SupplyExhaustionDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("SUPPLY_EXHAUSTION", rule); } }
/** Configurable demand-exhaustion detector. */ export class DemandExhaustionDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("DEMAND_EXHAUSTION", rule); } }
/** Configurable shakeout detector. */ export class ShakeoutDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("SHAKEOUT", rule); } }
/** Configurable mark-up detector. */ export class MarkUpDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("MARK_UP", rule); } }
/** Configurable mark-down detector. */ export class MarkDownDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("MARK_DOWN", rule); } }
/** Configurable false-breakout detector. */ export class FalseBreakoutDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("FALSE_BREAKOUT", rule); } }
/** Configurable false-breakdown detector. */ export class FalseBreakdownDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("FALSE_BREAKDOWN", rule); } }
/** Configurable smart-money-entry detector. */ export class SmartMoneyEntryDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("SMART_MONEY_ENTRY", rule); } }
/** Configurable smart-money-exit detector. */ export class SmartMoneyExitDetector extends NamedDetector { constructor(rule?: DetectorRule) { super("SMART_MONEY_EXIT", rule); } }
/** Creates the complete detector set in an explicitly unconfigured state. */
export function createDefaultDetectors(): readonly DeliveryDetector[] { return [new AccumulationDetector(new AccumulationRule()), new DistributionDetector(new DistributionRule()), new AbsorptionDetector(new AbsorptionRule()), new SupplyExhaustionDetector(new SupplyExhaustionRule()), new DemandExhaustionDetector(new DemandExhaustionRule()), new ShakeoutDetector(new ShakeoutRule()), new MarkUpDetector(new MarkUpRule()), new MarkDownDetector(new MarkDownRule()), new FalseBreakoutDetector(new FalseBreakoutRule()), new FalseBreakdownDetector(new FalseBreakdownRule()), new SmartMoneyEntryDetector(new SmartMoneyEntryRule()), new SmartMoneyExitDetector(new SmartMoneyExitRule())]; }
export { DeliveryDetector } from "./DeliveryDetector";













