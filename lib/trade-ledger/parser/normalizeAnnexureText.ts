export function normalizeAnnexureText(text:string):string{

  return text

    // Order No + Order Time
    .replace(/(\d{16})(\d{2}:\d{2}:\d{2})/g,"$1 $2")

    // Order Time + Trade No
    .replace(/(\d{2}:\d{2}:\d{2})(\d{8,9})/g,"$1 $2")

    // Trade No + Trade Time
    .replace(/(\d{8,9})(\d{2}:\d{2}:\d{2})/g,"$1 $2")

    // Trade Time + Symbol
    .replace(/(\d{2}:\d{2}:\d{2})([A-Z][A-Z0-9-]+-EQ)/g,"$1 $2")

    // Symbol / ISIN
    .replace(/([A-Z0-9-]+)\/(INE[A-Z0-9]{9})/g,"$1 / $2")

    // ISIN + B/S + Exchange
    .replace(/(INE[A-Z0-9]{9})([BS])(NSE|BSE)/g,"$1 $2 $3")

    // BNSE / SNSE / BBSE / SBSE
    .replace(/\bBNSE\b/g,"B NSE")
    .replace(/\bSNSE\b/g,"S NSE")
    .replace(/\bBBSE\b/g,"B BSE")
    .replace(/\bSBSE\b/g,"S BSE")

    // ISIN or Exchange split across lines
    .replace(/\r?\n(INE[A-Z0-9]{9})/g," $1")
    .replace(/\r?\n([BS]\s+(?:NSE|BSE))/g," $1")
    .replace(/\r?\n([BS]NSE|[BS]BSE)/g," $1")

    // Exchange followed immediately by quantity
    .replace(/(NSE|BSE)(\d)/g,"$1 $2")

    // Brokerage (4 decimals) followed by price (2 decimals)
    .replace(/(\d+\.\d{4})(\d+\.\d{2})/g,"$1 $2")

    // Price followed by total
    .replace(/(\d+\.\d{2})(\(?-?\d+\.\d{2}\)?)/g,"$1 $2")

    // Collapse whitespace
    .replace(/[ \t]+/g," ")
    .trim();

}

