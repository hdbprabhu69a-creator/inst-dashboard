type ScannerUpdate = {
  symbol: string;
  pattern: string;
  action?: "BUY" | "SELL" | "WATCH";
  confidence: number;
  prediction?: any;
};

class ScannerStore {

  private data: Map<string, ScannerUpdate> = new Map();
  private listeners: Function[] = [];

  update(update: ScannerUpdate) {
    this.data.set(update.symbol, update);
    this.emit();
  }

  getAll() {
    return Array.from(this.data.values());
  }

  subscribe(fn: Function) {
    this.listeners.push(fn);
  }

  private emit() {
    const all = this.getAll();
    this.listeners.forEach(fn => fn(all));
  }

}

export const scannerStore = new ScannerStore();

