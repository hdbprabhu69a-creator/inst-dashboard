# INST-DASHBOARD
## Institutional Trading Intelligence Platform

---

# Documentation Home

This folder contains the complete architecture and design documentation.

---

# Architecture

00_PROJECT_INDEX.md

01_PROJECT_FLOW.md

25_MODULE_DEPENDENCY_GRAPH.md

35_ARCHITECTURE_DECISIONS.md

---

# Live Market Engine

02_LIVE_DATA_PIPELINE.md

20_LIVE_DATA_FLOW.md

26_CALL_GRAPH.md

27_EVENT_FLOW.md

32_LIVE_CANDLE_SEQUENCE.md

---

# History Engine

03_HISTORY_PIPELINE.md

30_TRADINGVIEW_FLOW.md

---

# Chart Engine

04_CHART_ENGINE.md

23_CANDLE_ENGINE_GRAPH.md

---

# Pattern Engine

05_PATTERN_ENGINE.md

24_PATTERN_GRAPH.md

31_PATTERN_SEQUENCE.md

---

# Scanner Engine

06_SCANNER_ENGINE.md

---

# Firestore

07_FIRESTORE_SCHEMA.md

21_FIRESTORE_USAGE.md

28_FIRESTORE_COLLECTION_MAP.md

---

# APIs

08_API_ROUTES.md

13_API_ROUTES_INDEX.md

22_API_UI_MAP.md

29_API_SEQUENCE.md

---

# Components

09_COMPONENT_INDEX.md

14_COMPONENT_INDEX.md

15_HOOK_INDEX.md

16_SERVICE_INDEX.md

17_LIBRARY_INDEX.md

---

# Project Inventory

11_FILE_INDEX.md

12_FUNCTION_INDEX.md

18_FOLDER_STRUCTURE.txt

19_IMPORT_GRAPH.md

---

# Development

10_BUILD_HISTORY.md

34_BUILD_011B_DESIGN.md

33_DEBUG_GUIDE.md

---

# Overall System

                Kite WebSocket
                       │
                       ▼
               KiteLiveService
                       │
                       ▼
                 LiveTickHub
                       │
                       ▼
                  SSE Route
                       │
                       ▼
                liveBootstrap
                       │
                       ▼
                  liveEngine
                  ┌─────────────┐
                  ▼             ▼
            candleEngine   ohlcEngine
                  │             │
                  └──────┬──────┘
                         ▼
                CandlestickChart
                         │
                         ▼
                 Pattern Engine
                         │
                         ▼
                 Institutional UI

---

Project Status

✔ History Engine

✔ Live Tick Pipeline

✔ Symbol Routing

✔ Per Symbol OHLC

✔ Architecture Documentation

□ Official Live Daily Candle

□ Pattern Auto Draw

□ Scanner Completion

□ Institutional Dashboard Completion

---

Generated Documentation Files : 35

Documentation Version : BUILD-011B

