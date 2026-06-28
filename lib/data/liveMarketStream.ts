import { KiteTicker } from "kiteconnect";

type Tick = {
  instrument_token: number;
  last_price: number;
};
import { StockRouter } from './stockRouter';
export class LiveMarketStream {

  private ticker: any;
  private callbacks: Map<number, Function[]> = new Map();

  constructor(apiKey: string, accessToken: string) {
    this.ticker = new KiteTicker({
      api_key: apiKey,
      access_token: accessToken,
    });
  }

  connect(tokens: number[]) {
    this.ticker.on("ticks", (ticks: Tick[]) => {
      this.onTicks(ticks);
    });

    this.ticker.connect();
    this.ticker.subscribe(tokens);
  }

  onTicks(ticks: Tick[]) {
    for (const tick of ticks) {
      const token = tick.instrument_token;
      const list = this.callbacks.get(token);

      if (list) {
        list.forEach(fn => fn(tick));
      }
    }
  }

  on(token: number, callback: Function) {
    if (!this.callbacks.has(token)) {
      this.callbacks.set(token, []);
    }

    this.callbacks.get(token)!.push(callback);
  }
}
