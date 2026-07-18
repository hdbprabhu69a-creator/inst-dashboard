import type {
  DetectorResult,
  DeliveryMetricsSnapshot,
  SignalResult,
  SignalStrategy
} from "./DeliveryTypes";

export class DeliverySignals {

  evaluate(
    metrics: DeliveryMetricsSnapshot | null,
    detectors: readonly DetectorResult[],
    strategy?: SignalStrategy
  ): SignalResult {

    if(strategy){
      return strategy.signal(metrics,detectors);
    }

    const has=(name:string)=>
      detectors.some(d=>d.detector===name && d.detected);

const accumulation=has("ACCUMULATION");
const distribution=has("DISTRIBUTION");
const absorption=has("ABSORPTION");
const smartMoneyEntry=has("SMART_MONEY_ENTRY");
const smartMoneyExit=has("SMART_MONEY_EXIT");

    if(
      has("SMART_MONEY_ENTRY") &&
      has("ACCUMULATION") &&
      has("MARK_UP")
    ){
      return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
        signal:"BUY_ZONE",
        configured:true,
        rationale:"Smart money entry with accumulation and mark-up."
      };
    }

    if(
      has("ACCUMULATION") &&
      has("ABSORPTION")
    ){
      return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
        signal:"ACCUMULATION",
        configured:true,
        rationale:"Accumulation supported by absorption."
      };
    }

    if(
      has("MARK_UP")
    ){
      return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
        signal:"WATCH",
        configured:true,
        rationale:"Positive mark-up structure."
      };
    }

    if(
      has("SMART_MONEY_EXIT") &&
      has("DISTRIBUTION")
    ){
      return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
        signal:"EXIT",
        configured:true,
        rationale:"Smart money exit with distribution."
      };
    }

    if(
      has("DEMAND_EXHAUSTION") &&
      has("MARK_DOWN")
    ){
      return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
        signal:"AVOID",
        configured:true,
        rationale:"Demand exhaustion during mark-down."
      };
    }

    if(
      has("DISTRIBUTION") ||
      has("MARK_DOWN")
    ){
      return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
        signal:"DISTRIBUTION",
        configured:true,
        rationale:"Distribution characteristics detected."
      };
    }

    return{
      accumulation,
      distribution,
      absorption,
      smartMoneyEntry,
      smartMoneyExit,
      signal:"NEUTRAL",
      configured:true,
      rationale:"No dominant institutional signal."
    };

  }

}

