export type TradeSignal = {
  symbol: string;
  price: number;
  direction: "BUY" | "SELL";
  quantity: number;
};

type Mode = "PAPER" | "LIVE";

class ExecutionEngine {

  private mode: Mode = "PAPER"; // SAFE PAPER RUN ACTIVE
  private isKilled = false;

  setMode(mode: Mode) {
    this.mode = mode;
  }

  killSwitch() {
    this.isKilled = true;
  }

  revive() {
    this.isKilled = false;
  }

  execute(signal: TradeSignal) {

    if (this.isKilled) {
return;
    }

    if (this.mode === "PAPER") {
return {
        status: "PAPER_EXECUTED",
        signal
      };
    }

    if (this.mode === "LIVE") {
// ?? REAL BROKER INTEGRATION POINT
      // KiteConnect / Zerodha / API call goes here

      return {
        status: "LIVE_EXECUTED",
        signal
      };
    }

  }

}

export const executionEngine = new ExecutionEngine();



