export class TradeLedgerParseError extends Error {

  constructor(message: string) {
    super(message);
    this.name = "TradeLedgerParseError";
  }

}

