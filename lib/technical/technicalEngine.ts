export type Candle = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type TechnicalRow = {
  date: string
  high: number
  low: number
  close: number
  rsi: number | null
  adx: number | null
  plusDI: number | null
  minusDI: number | null
  macd: number | null
  signal: number | null
  histogram: number | null
  cci: number | null
}

function ema(v: number[], p: number) {
  const out: (number | null)[] = Array(v.length).fill(null)
  if (v.length < p) return out

  let e = v.slice(0, p).reduce((a, b) => a + b, 0) / p
  out[p - 1] = e

  const k = 2 / (p + 1)

  for (let i = p; i < v.length; i++) {
    e = (v[i] - e) * k + e
    out[i] = e
  }

  return out
}

function rsi(c: number[], p = 14) {
  const out: (number | null)[] = Array(c.length).fill(null)
  if (c.length <= p) return out

  let gain = 0
  let loss = 0

  for (let i = 1; i <= p; i++) {
    const d = c[i] - c[i - 1]
    if (d > 0) gain += d
    else loss -= d
  }

  let ag = gain / p
  let al = loss / p

  out[p] = al === 0 ? 100 : 100 - 100 / (1 + ag / al)

  for (let i = p + 1; i < c.length; i++) {
    const d = c[i] - c[i - 1]
    const g = Math.max(d, 0)
    const l = Math.max(-d, 0)

    ag = (ag * (p - 1) + g) / p
    al = (al * (p - 1) + l) / p

    out[i] = al === 0 ? 100 : 100 - 100 / (1 + ag / al)
  }

  return out
}

function adx(c: Candle[], p = 14) {
  const n = c.length
  const a: (number | null)[] = Array(n).fill(null)
  const plus: (number | null)[] = Array(n).fill(null)
  const minus: (number | null)[] = Array(n).fill(null)

  if (n <= p * 2) return { a, plus, minus }

  const tr = Array(n).fill(0)
  const pdm = Array(n).fill(0)
  const mdm = Array(n).fill(0)

  for (let i = 1; i < n; i++) {
    const up = c[i].high - c[i - 1].high
    const down = c[i - 1].low - c[i].low

    pdm[i] = up > down && up > 0 ? up : 0
    mdm[i] = down > up && down > 0 ? down : 0

    tr[i] = Math.max(
      c[i].high - c[i].low,
      Math.abs(c[i].high - c[i - 1].close),
      Math.abs(c[i].low - c[i - 1].close)
    )
  }

  let atr = 0
  let psm = 0
  let msm = 0

  for (let i = 1; i <= p; i++) {
    atr += tr[i]
    psm += pdm[i]
    msm += mdm[i]
  }

  atr /= p
  psm /= p
  msm /= p

  const dx: (number | null)[] = Array(n).fill(null)

  for (let i = p; i < n; i++) {
    if (i > p) {
      atr = (atr * (p - 1) + tr[i]) / p
      psm = (psm * (p - 1) + pdm[i]) / p
      msm = (msm * (p - 1) + mdm[i]) / p
    }

    const pi = atr ? (psm / atr) * 100 : 0
    const mi = atr ? (msm / atr) * 100 : 0

    plus[i] = pi
    minus[i] = mi

    dx[i] = pi + mi
      ? Math.abs(pi - mi) / (pi + mi) * 100
      : 0
  }

  const first = p * 2 - 1
  let sum = 0

  for (let i = p; i <= first; i++) {
    sum += dx[i] ?? 0
  }

  a[first] = sum / p

  for (let i = first + 1; i < n; i++) {
    a[i] = (a[i - 1]! * (p - 1) + (dx[i] ?? 0)) / p
  }

  return { a, plus, minus }
}

function macd(c: number[]) {
  const fast = ema(c, 12)
  const slow = ema(c, 26)

  const m: (number | null)[] = Array(c.length).fill(null)

  for (let i = 0; i < c.length; i++) {
    if (fast[i] != null && slow[i] != null) {
      m[i] = fast[i]! - slow[i]!
    }
  }

  const values: number[] = []
  const indexes: number[] = []

  m.forEach((v, i) => {
    if (v != null) {
      values.push(v)
      indexes.push(i)
    }
  })

  const s = ema(values, 9)
  const signal: (number | null)[] = Array(c.length).fill(null)
  const histogram: (number | null)[] = Array(c.length).fill(null)

  s.forEach((v, i) => {
    if (v != null) {
      const index = indexes[i]
      signal[index] = v
      histogram[index] = m[index]! - v
    }
  })

  return { m, signal, histogram }
}

function cci(c: Candle[], p = 20) {
  const out: (number | null)[] = Array(c.length).fill(null)
  const tp = c.map(x => (x.high + x.low + x.close) / 3)

  for (let i = p - 1; i < c.length; i++) {
    const start = i - p + 1
    const values = tp.slice(start, i + 1)
    const mean = values.reduce((a, b) => a + b, 0) / p
    const dev = values.reduce((a, b) => a + Math.abs(b - mean), 0) / p

    out[i] = dev === 0 ? 0 : (tp[i] - mean) / (0.015 * dev)
  }

  return out
}

function aggregate(c: Candle[], tf: "D" | "W" | "M") {
  if (tf === "D") return c

  const groups = new Map<string, Candle[]>()

  for (const x of c) {
    const d = new Date(x.time + "T00:00:00")
    const key = tf === "W"
      ? (() => {
          const z = new Date(d)
          const day = z.getDay() || 7
          z.setDate(z.getDate() - day + 1)
          return z.toISOString().slice(0, 10)
        })()
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

    const arr = groups.get(key) ?? []
    arr.push(x)
    groups.set(key, arr)
  }

  const result = [...groups.values()].map(arr => {
    arr.sort((a, b) => a.time.localeCompare(b.time))

    return {
      time: arr[arr.length - 1].time,
      open: arr[0].open,
      high: Math.max(...arr.map(x => x.high)),
      low: Math.min(...arr.map(x => x.low)),
      close: arr[arr.length - 1].close,
      volume: arr.reduce((s, x) => s + x.volume, 0)
    }
  })

  /*
   * Do not use the currently forming W/M candle.
   * Only completed weekly/monthly candles are used.
   */

  const now = new Date()

  if (tf === "W") {
    const day = now.getDay() || 7
    const currentWeekMonday = new Date(now)

    currentWeekMonday.setHours(0, 0, 0, 0)
    currentWeekMonday.setDate(
      currentWeekMonday.getDate() - day + 1
    )

    return result.filter(
      x =>
        new Date(x.time + "T00:00:00") <
        currentWeekMonday
    )
  }

  if (tf === "M") {
    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

    return result.filter(
      x =>
        new Date(x.time + "T00:00:00") <
        currentMonthStart
    )
  }

  return result
}

export function calculateTechnical(
  candles: Candle[],
  tf: "D" | "W" | "M"
): TechnicalRow[] {
  const rows = aggregate(candles, tf)
  const closes = rows.map(x => x.close)

  const r = rsi(closes)
  const d = adx(rows)
  const m = macd(closes)
  const c = cci(rows)

  return rows.map((x, i) => ({
    date: x.time,
    high: x.high,
    low: x.low,
    close: x.close,
    rsi: r[i],
    adx: d.a[i],
    plusDI: d.plus[i],
    minusDI: d.minus[i],
    macd: m.m[i],
    signal: m.signal[i],
    histogram: m.histogram[i],
    cci: c[i]
  }))
}


