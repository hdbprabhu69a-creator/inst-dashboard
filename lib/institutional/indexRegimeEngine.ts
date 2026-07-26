type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;

  const slice = values.slice(-period);

  return (
    slice.reduce((sum, value) => sum + value, 0) /
    period
  );
}

function ema(
  values: number[],
  period: number
): number | null {

  if (values.length < period)
    return null;

  const k = 2 / (period + 1);

  let result = values[0];

  for (let i = 1; i < values.length; i++) {
    result =
      values[i] * k +
      result * (1 - k);
  }

  return result;
}

function calculateRSI(
  closes: number[],
  period = 14
): number {

  if (closes.length <= period)
    return 50;

  let gain = 0;
  let loss = 0;

  for (
    let i = closes.length - period;
    i < closes.length;
    i++
  ) {

    const diff =
      closes[i] -
      closes[i - 1];

    if (diff > 0)
      gain += diff;
    else
      loss += Math.abs(diff);

  }

  if (loss === 0)
    return 100;

  const rs = gain / loss;

  return 100 - (100 / (1 + rs));
}

function calculateADX(
  candles: Candle[],
  period = 14
): number {

  if (
    candles.length <
    period + 1
  )
    return 20;

  let plusDM = 0;
  let minusDM = 0;
  let tr = 0;

  for (
    let i = candles.length - period;
    i < candles.length;
    i++
  ) {

    const current =
      candles[i];

    const previous =
      candles[i - 1];

    const upMove =
      current.high -
      previous.high;

    const downMove =
      previous.low -
      current.low;

    if (
      upMove > downMove &&
      upMove > 0
    )
      plusDM += upMove;

    if (
      downMove > upMove &&
      downMove > 0
    )
      minusDM += downMove;

    tr += Math.max(
      current.high - current.low,
      Math.abs(
        current.high -
        previous.close
      ),
      Math.abs(
        current.low -
        previous.close
      )
    );

  }

  if (tr === 0)
    return 20;

  const plusDI =
    (plusDM / tr) * 100;

  const minusDI =
    (minusDM / tr) * 100;

  const dx =
    Math.abs(
      plusDI - minusDI
    ) /
    (plusDI + minusDI || 1) *
    100;

  return Number(
    Math.min(dx, 60).toFixed(2)
  );
}
export function analyzeIndexRegime(
  candles: Candle[],
  liveCmp?: number
) {

  if (candles.length < 200) {

    return {

      regime: "UNKNOWN",

      phase: "UNKNOWN",

      structure: "UNKNOWN",

      confidence: 0,

      institutionalBias: "UNKNOWN",

      liveCmp: liveCmp ?? 0,

      indicators: {}

    };

  }

  const closes =
    candles.map(c => c.close);

  const latestClose =
    closes.at(-1)!;

  const cmp =
    liveCmp ?? latestClose;

  const dma20 =
    sma(closes, 20);

  const dma50 =
    sma(closes, 50);

  const dma100 =
    sma(closes, 100);

  const dma200 =
    sma(closes, 200);

  const ema12 =
    ema(closes, 12);

  const ema26 =
    ema(closes, 26);

  const macd =
    (ema12 ?? 0) -
    (ema26 ?? 0);

  const rsi =
    calculateRSI(closes);

  const adx =
    calculateADX(candles);

  const high20 =
    Math.max(
      ...closes.slice(-20)
    );

  const low20 =
    Math.min(
      ...closes.slice(-20)
    );

  let structure =
    "RANGE";

  if (latestClose >= high20)
    structure = "HIGHER_HIGH";

  else if (latestClose <= low20)
    structure = "LOWER_LOW";

  else {

    const prev =
      closes[closes.length - 2];

    if (latestClose > prev)
      structure = "HIGHER_LOW";

    else
      structure = "LOWER_HIGH";

  }

  let score = 0;

  if (
    dma20 &&
    latestClose > dma20
  )
    score += 10;

  if (
    dma50 &&
    latestClose > dma50
  )
    score += 20;

  if (
    dma100 &&
    latestClose > dma100
  )
    score += 30;

  if (
    dma200 &&
    latestClose > dma200
  )
    score += 40;

  if (macd > 0)
    score += 10;
  else
    score -= 10;

  if (rsi > 60)
    score += 10;

  if (rsi < 40)
    score -= 10;

  if (adx > 25)
    score += 10;

  score =
    Math.max(
      0,
      Math.min(score, 100)
    );

  let regime =
    "NEUTRAL";

  let phase =
    "CONSOLIDATION";

  let bias =
    "NEUTRAL";

  if (score >= 75) {

    regime = "BULLISH";

    phase = "MARKUP";

    bias = "RISK_ON";

  }

  else if (score <= 30) {

    regime = "BEARISH";

    phase = "MARKDOWN";

    bias = "RISK_OFF";

  }

  else {

    regime = "NEUTRAL";

    phase = "RANGE";

    bias = "BALANCED";

  }
    return {

    liveCmp: Number(cmp.toFixed(2)),

    regime,

    phase,

    structure,

    confidence: score,

    institutionalBias: bias,

    confirmation: {

      adx: Number(adx.toFixed(2)),

      trendStrength:
        adx >= 30
          ? "VERY_STRONG"
          : adx >= 25
          ? "STRONG"
          : adx >= 20
          ? "MODERATE"
          : "WEAK",

      macd:

        macd >= 0
          ? "POSITIVE"
          : "NEGATIVE",

      rsi:

        Number(rsi.toFixed(2))

    },

    indicators: {

      close:
        Number(latestClose.toFixed(2)),

      dma20:
        Number(dma20?.toFixed(2) ?? 0),

      dma50:
        Number(dma50?.toFixed(2) ?? 0),

      dma100:
        Number(dma100?.toFixed(2) ?? 0),

      dma200:
        Number(dma200?.toFixed(2) ?? 0),

      macd:
        Number(macd.toFixed(2)),

      rsi:
        Number(rsi.toFixed(2)),

      adx:
        Number(adx.toFixed(2))

    }

  };

}