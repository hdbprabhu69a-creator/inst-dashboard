import { IChartApi } from "lightweight-charts";

type SeriesRef = {
  id: string;
  series: any;
};

export class PatternSeriesManager {

  private static store: Map<IChartApi, SeriesRef[]> = new Map();

  static clear(chart: IChartApi) {

    const existing = this.store.get(chart);

    if (!existing) return;

    for (const s of existing) {
      try {
        chart.removeSeries(s.series);
      } catch {}
    }

    this.store.set(chart, []);
  }

  static register(chart: IChartApi, series: any, id: string) {

    if (!this.store.has(chart)) {
      this.store.set(chart, []);
    }

    this.store.get(chart)!.push({ id, series });

  }

}

