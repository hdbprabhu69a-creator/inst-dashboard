export type HeatmapItem = {
  symbol: string;
  strength: number; // -100 to +100
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  pattern?: string;
};

class HeatmapEngine {

  private map: Map<string, HeatmapItem> = new Map();
  private listeners: Function[] = [];

  update(item: HeatmapItem) {
    this.map.set(item.symbol, item);
    this.emit();
  }

  getAll() {
    return Array.from(this.map.values());
  }

  subscribe(fn: Function) {
    this.listeners.push(fn);
  }

  private emit() {
    const all = this.getAll();
    this.listeners.forEach(fn => fn(all));
  }

}

export const heatmapEngine = new HeatmapEngine();
