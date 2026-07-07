# ARCHITECTURE DECISIONS

History is immutable.

Live Engine is independent.

Pattern Engine reads candles only.

TradingView never calculates data.

Firestore is Source of Truth.

Live updates never overwrite history.

Each symbol maintains independent state.

Event driven architecture.
