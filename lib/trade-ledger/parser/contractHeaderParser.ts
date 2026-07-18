import { findText } from "../utils/regex";

export interface ContractHeader {

  contractNoteNumber?: string;

  invoiceReferenceNumber?: string;

  tradeDate?: string;

  settlementNumber?: string;

  settlementDate?: string;

  segment?: string;

}

export function parseContractHeader(
  text: string
): ContractHeader {

  const contractNoteNumber =
    findText(text,/Contract Note No:\s*([A-Z0-9\-\/]+)/i);

  const invoiceReferenceNumber =
    findText(text,/Invoice Reference Number\(IRN\):\s*([A-Z0-9\-\/]+)/i);

  const tradeDate =
    findText(text,/Trade Date:\s*([0-9\/]+)/i);

  const settlementNumber =
    findText(text,/Settlement No:\s*([0-9]+)/i);

  const settlementDate =
    findText(text,/Settlement Date:\s*([0-9\/]+)/i);

  const segment =
    text.includes("NCL-F&O")
      ? "NCL-CASH+FNO"
      : "NCL-CASH";return{

    contractNoteNumber,

    invoiceReferenceNumber,

    tradeDate,

    settlementNumber,

    settlementDate,

    segment

  };

}





