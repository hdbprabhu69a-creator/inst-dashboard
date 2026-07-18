export const PATTERNS={

  brokerage:/Brokerage\s+([\d.]+)/i,

  exchangeCharges:/Exchange\s+transaction\s+charges\s+([\d.]+)/i,

  stt:/STT\s+([\d.]+)/i,

  sebiCharges:/SEBI.*?([\d.]+)/i,

  igst:/IGST\s+([\d.]+)/i,

  cgst:/CGST\s+([\d.]+)/i,

  sgst:/SGST\s+([\d.]+)/i,

  stampDuty:/Stamp\s+Duty\s+([\d.]+)/i,

  isin:/INE[A-Z0-9]{9}/,

  time:/\d{2}:\d{2}:\d{2}/,

  number:/-?\d+(?:\.\d+)?/g,

  nse:/^NSE$/,

  bse:/^BSE$/

};

export const ISIN=PATTERNS.isin;
export const TIME=PATTERNS.time;
export const NUMBER=PATTERNS.number;
export const NSE=PATTERNS.nse;
export const BSE=PATTERNS.bse;
