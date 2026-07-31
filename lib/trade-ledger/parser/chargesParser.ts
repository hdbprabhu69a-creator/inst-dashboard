import type { Charges } from "../types";
import { PATTERNS } from "../tokenizer/patterns";
import { findNumber } from "../utils/regex";

export function parseCharges(
  text:string
):Charges{

  const brokerage=findNumber(text,PATTERNS.brokerage);

  const exchangeCharges=findNumber(text,PATTERNS.exchangeCharges);

  const stt=findNumber(text,PATTERNS.stt);

  const sebiCharges=findNumber(text,PATTERNS.sebiCharges);

  const gst=
    findNumber(text,PATTERNS.igst)||
    findNumber(text,PATTERNS.cgst)+
    findNumber(text,PATTERNS.sgst);

  const stampDuty=findNumber(text,PATTERNS.stampDuty);

  const clearingCharges=0;

  const ipftCharges=0;

  const otherCharges=0;

  return{

    brokerage,

    exchangeCharges,

    stt,

    sebiCharges,

    gst,

    stampDuty,

    clearingCharges,

    ipftCharges,

    otherCharges,

    totalCharges:
      brokerage+
      exchangeCharges+
      stt+
      sebiCharges+
      gst+
      stampDuty

  };

}


