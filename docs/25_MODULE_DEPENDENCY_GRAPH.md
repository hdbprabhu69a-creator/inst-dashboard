# MODULE DEPENDENCY GRAPH

KiteLiveService
    ¦
    ?
LiveTickHub
    ¦
    ?
SSE Route
    ¦
    ?
liveBootstrap
    ¦
    ?
liveEngine
    +--------------? candleEngine
    ¦                    ¦
    ¦                    ?
    ¦               TradingView
    ¦
    +--------------? ohlcEngine
                         ¦
                         ?
                  OHLC Header

History
    ¦
    ?
firebaseHistory
    ¦
    ?
aggregateCandles
    ¦
    ?
initializeHistory
    ¦
    ?
TradingView

TradingView
    ¦
    ?
detectPatterns
    ¦
    ?
PatternOverlay
    ¦
    ?
PatternLabels
    ¦
    ?
PatternInfoOverlay
