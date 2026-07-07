# PROJECT FLOW

KITE WEBSOCKET
        │
        ▼
KiteLiveService.ts
        │
        ▼
LiveTickHub.ts
        │
        ▼
SSE route
        │
        ▼
liveBootstrap.ts
        │
        ▼
liveEngine.ts
        │
   ┌────┴─────┐
   ▼          ▼
candle     ohlc
engine     engine
   │          │
   └────┬─────┘
        ▼
CandlestickChart.tsx
