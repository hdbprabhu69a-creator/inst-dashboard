import type { ContractNote } from "../types";

export function validateContractNote(
  contract: ContractNote
): void {

  if (contract.trades.length === 0) {
    throw new Error("No trades found.");
  }

  if (contract.charges.totalCharges < 0) {
    throw new Error("Invalid charges.");
  }

}
