import type {ContractNote} from "../types";

import {splitContractNotes} from "./splitContractNotes";
import {parseContractHeader} from "./contractHeaderParser";
import {parseEquitySummary} from "./equitySummaryParser";
import {parseAnnexure} from "./annexureParser";
import {parseCharges} from "./chargesParser";
import {parseSettlement} from "./settlementParser";

export function parseTradeLedger(
  text:string
):ContractNote[]{

  const notes:ContractNote[]=[];

  for(const section of splitContractNotes(text)){

    const header=parseContractHeader(section);

    notes.push({

      trades:parseAnnexure(
        section,
        header.tradeDate ?? ""
      ),

      charges:parseCharges(section),

      settlement:parseSettlement(section),

      equity:parseEquitySummary(section),

      instruments:[]

    });

  }

  return notes;

}

