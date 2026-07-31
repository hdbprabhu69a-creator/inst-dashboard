import type { SettlementSummary } from "../types";

export function parseSettlement(
  text: string
): SettlementSummary {

  return {
    settlementNumber: undefined,
    settlementDate: undefined,
    grossBuyValue: 0,
    grossSellValue: 0,
    turnover: 0,
    netAmount: 0
  };

}

