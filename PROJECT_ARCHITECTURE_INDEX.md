# INST-DASHBOARD PROJECT ARCHITECTURE INDEX

---

# 1. PROJECT FLOW

KITE WEBSOCKET
    │
    ▼
lib/server/live/KiteLiveService.ts
    │
    ▼
lib/server/stream/LiveTickHub.ts
    │
    ▼
app/api/live/stream/route.ts
    │
    ▼
lib/live/liveBootstrap.ts
    │
    ▼
lib/live/liveEngine.ts
    │
    ├──────────────► lib/live/candleEngine.ts
    │                    │
    │                    ▼
    │              TradingView Candle
    │
    └──────────────► lib/live/ohlcEngine.ts
                         │
                         ▼
                    OHLC Header
                         │
                         ▼
              lib/chart/CandlestickChart.tsx

---

# 2. LIVE DATA PIPELINE

KiteLiveService.ts
------------------
Purpose
- Connects to KiteTicker
- Subscribes FULL mode
- Receives raw websocket ticks

Produces
- symbol
- lastPrice
- exchange_timestamp
- raw tick

Current Issue
- OHLC and volume are available inside raw tick but not forwarded.

------------------------------------------------

LiveTickHub.ts
--------------
Purpose
- Broadcast hub
- No calculations
- Sends tick to subscribers

------------------------------------------------

route.ts
--------
Purpose
- SSE endpoint
- Streams JSON tick
- No calculations

------------------------------------------------

liveBootstrap.ts
----------------
Purpose
- Browser EventSource
- Receives SSE
- Sends tick to liveEngine

------------------------------------------------

liveEngine.ts
-------------
Purpose
- Tick validation
- Duplicate filtering
- Symbol routing
- Passes tick to candleEngine
- Passes tick to ohlcEngine

------------------------------------------------

candleEngine.ts
---------------
Purpose
- Creates live candles
- Bucket calculation
- Timeframe aggregation
- Emits Candle[]

------------------------------------------------

ohlcEngine.ts
-------------
Purpose
- Stores current live OHLC
- Per-symbol state
- Emits OHLC

------------------------------------------------

CandlestickChart.tsx
--------------------
Purpose
- Loads history
- Loads live candle
- Updates TradingView
- Crosshair
- Header
- Pattern Overlay

---

# 3. HISTORY PIPELINE

Firestore
    │
    ▼
firebaseHistory.ts
    │
    ▼
aggregateCandles.ts
    │
    ▼
initializeHistory()
    │
    ▼
TradingView

---

# 4. PATTERN ENGINE

History
    │
    ▼
Live Candle
    │
    ▼
detectPatterns()
    │
    ▼
PatternOverlay.tsx
    │
    ▼
PatternLabels.tsx
    │
    ▼
PatternInfoOverlay.tsx

---

# 5. FILE RESPONSIBILITIES

KiteLiveService.ts
    Raw websocket

LiveTickHub.ts
    Broadcast

route.ts
    SSE

liveBootstrap.ts
    Browser live client

liveEngine.ts
    Tick routing

candleEngine.ts
    Live candle generation

ohlcEngine.ts
    Live OHLC generation

CandlestickChart.tsx
    TradingView integration

aggregateCandles.ts
    Timeframe aggregation

firebaseHistory.ts
    Firestore history

PatternOverlay.tsx
    Pattern drawing

PatternLabels.tsx
    Pattern labels

PatternInfoOverlay.tsx
    Pattern information

---

# 6. CURRENT STATUS

✔ History Working

✔ Live Tick Working

✔ Per Symbol Tick Working

✔ Per Symbol OHLC Working

✔ Hover Header Working

✔ Volume Header Working

□ Live Daily Candle (Official OHLC)

□ Pattern Auto Draw

□ Scanner Integration

□ Institutional Dashboard

---

Last Updated : BUILD-011B
