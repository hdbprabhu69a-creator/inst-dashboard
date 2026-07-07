
==================================================
app\api\alerts\whatsapp\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\build-heatmap-cache\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\build-sector-heatmap-cache\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\build-trend-score\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\businessline-news\route.ts
==================================================
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

==================================================
app\api\businessline-rss\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\cleanup-audit-csv\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\corporate-announcements\route.ts
==================================================
import { NextResponse } from "next/server";
import { getCorporateAnnouncements } from "@/lib/corporate/source";

==================================================
app\api\corporate-refresh\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\debug\gujgas\route.ts
==================================================
import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

==================================================
app\api\debug-history\route.ts
==================================================
import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

==================================================
app\api\delete-history\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\delete-test\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\deletion-report-csv\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\delivery-bulk\route.ts
==================================================
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import {
import { db } from "@/lib/firebase";
import {

==================================================
app\api\eod-refresh\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\event-calendar\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\export-csv\route.ts
==================================================
import { Workbook } from "exceljs";

==================================================
app\api\export-history\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\export-history-excel\route.ts
==================================================
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import {
import { collection,getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

==================================================
app\api\firebase-audit\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\firebase-audit-csv\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\heatmap\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\heatmap-quotes\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\history\route.ts
==================================================
import { NextRequest, NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\import-history\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\instruments\route.ts
==================================================
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

==================================================
app\api\jobs\businessline\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\jobs\businessline-init\route.ts
==================================================
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

==================================================
app\api\jobs\businessline-news\route.ts
==================================================
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { adminDb } from "@/lib/firebase-admin";

==================================================
app\api\kite\history\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\populate-history\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { adminDb } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import { getHistoricalCandles } from "@/lib/kite/historical";

==================================================
app\api\kite\populate-tokens\route.ts
==================================================
import { NextResponse } from "next/server";
import axios from "axios";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\kite\preview-history\route.ts
==================================================
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\repair-history\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\sync-history\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\test-history\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\test-history-url\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\test-token\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\kite\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\live\stream\route.ts
==================================================
import { liveTickHub } from "@/lib/server/stream/LiveTickHub";
import { ensureLiveServerStarted } from "@/lib/server/bootstrap/liveServerBootstrap";

==================================================
app\api\macro-dashboard\route.ts
==================================================
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {

==================================================
app\api\macro-refresh\route.ts
==================================================
import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { db } from "@/lib/firebase";
import {

==================================================
app\api\market-heatmap\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\market-structure\generate-all\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\market-structure\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import {

==================================================
app\api\market-structure-audit\route.backup.ts
==================================================
import { Workbook } from "exceljs";

==================================================
app\api\market-structure-audit\route.ts
==================================================
import { Workbook } from "exceljs";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\market-structure-bulk\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import {

==================================================
app\api\market-structure-bulk-v2\route.ts
==================================================
import {
import {
import {
import {
import {
import {
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\market-structure-csv\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\pattern-analysis\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\scan-stock\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\scan-universe\route.ts
==================================================
import { NextResponse } from "next/server";

==================================================
app\api\scanner\route.ts
==================================================
import { NextResponse } from "next/server";
import { sendEmail } from "@/src/services/email";
import {
import { db } from "@/lib/firebase";
import {

==================================================
app\api\scanner-alert\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";
import {
import {
import {

==================================================
app\api\scanner-filter\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\sector-heatmap\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\sector-stocks\route.ts
==================================================
import { NextRequest, NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\structure-scan\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\swing-cache-bulk\route.ts
==================================================
import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import {
import { db } from "@/lib/firebase";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";

==================================================
app\api\sync-sector-to-heatmap-cache\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\telegram-buyzone\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";
import {

==================================================
app\api\test-email\route.ts
==================================================
import { NextResponse } from "next/server";
import { sendEmail } from "@/src/services/email";

==================================================
app\api\test-firestore\route.ts
==================================================
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

==================================================
app\api\token\route.ts
==================================================
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

==================================================
app\api\universe\route.ts
==================================================
import { NextResponse } from "next/server";
import {
import { db } from "@/lib/firebase";

==================================================
app\api\watchlist\route.ts
==================================================
import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";
import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

==================================================
app\chart-analysis\page.tsx
==================================================
import { startLiveBootstrap, stopLiveBootstrap } from "@/lib/live/liveBootstrap";
import { useEffect, useState } from "react";
import { setCurrentSymbol } from "@/lib/live/symbolManager";
import CandlestickChart from "@/lib/chart/CandlestickChart";
import { candleEngine } from "@/lib/live/candleEngine";

==================================================
app\components\InstitutionalDashboard.tsx
==================================================
import { useState } from "react";
import LiveScanner from "./LiveScanner";
import LiveChart from "./LiveChart";
import { heatmapEngine } from "@/lib/data/heatmapEngine";

==================================================
app\components\LiveChart.tsx
==================================================
import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { liveUIBridge } from "@/lib/data/liveUIBridge";
import SDKPatternRenderer from "@/lib/chart/SDKPatternRenderer";
import { buildRenderPlan } from "@/lib/chart/render/buildRenderPlan";

==================================================
app\components\LiveDashboard.tsx
==================================================
import { useState, useEffect } from "react";
import LiveChart from "./LiveChart";
import { heatmapEngine } from "@/lib/data/heatmapEngine";
import { performanceDashboard } from "@/lib/engine/performanceDashboard";
import { statisticsEngine } from "@/lib/engine/statisticsEngine";
import { learningEngine } from "@/lib/engine/learningEngine";

==================================================
app\components\LiveScanner.tsx
==================================================
import { useEffect, useState } from "react";
import { scannerStore } from "@/lib/data/scannerStore";

==================================================
app\components\ProTradingTerminal.tsx
==================================================
import { useEffect, useState } from "react";
import LiveChart from "./LiveChart";
import { heatmapEngine } from "@/lib/data/heatmapEngine";
import { statisticsEngine } from "@/lib/engine/statisticsEngine";
import { performanceDashboard } from "@/lib/engine/performanceDashboard";

==================================================
app\heatmap\page.tsx
==================================================
import { useEffect, useState } from "react";

==================================================
app\institutional-desk\page.tsx
==================================================
import { useState } from "react";
import MacroStrip from "@/components/institutional/MacroStrip";
import BusinesslineFeed from "@/components/institutional/BusinesslineFeed";
import MajorEventTracker from "@/components/institutional/MajorEventTracker";
import CorporateAnnouncements from "@/components/institutional/CorporateAnnouncements";

==================================================
app\market-heatmap\page.tsx
==================================================
import { useEffect, useState } from "react";

==================================================
app\scanner\page.tsx
==================================================
import {

==================================================
app\sector\[sector]\page.tsx
==================================================

==================================================
app\sector-heatmap\page.tsx
==================================================
import { useEffect, useState } from "react";
import Link from "next/link";

==================================================
app\watchlist\page.tsx
==================================================
import { useEffect, useState } from "react";

==================================================
app\layout.tsx
==================================================
import type { Metadata } from "next";
import "./globals.css";
import LiveBootstrapClient from "@/components/live/LiveBootstrapClient";
import {

==================================================
app\page.tsx
==================================================
import { useEffect } from "react";
import { kite } from "@/lib/kite";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import BrokerConnectionManager from "@/components/BrokerConnectionManager";
import MarketSnapshot from "@/components/MarketSnapshot";
import EodButton from "@/components/EodButton";
import VerifyButton from "@/components/VerifyButton";
import DeliveryImportButton from "@/components/DeliveryImportButton";
import PivotTable from "@/components/PivotTable";
import CPRTable from "@/components/CPRTable";
import VWAPTable from "@/components/VWAPTable";
import VolumeTable from "@/components/VolumeTable";
import SwingTable from "@/components/SwingTable";
import FibTable from "@/components/FibTable";
import {

==================================================
app\page_BACKUP_FINAL.tsx
==================================================
import { useEffect } from "react";
import { kite } from "@/lib/kite";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import BrokerConnectionManager from "@/components/BrokerConnectionManager";
import MarketSnapshot from "@/components/MarketSnapshot";
import EodButton from "@/components/EodButton";
import VerifyButton from "@/components/VerifyButton";
import DeliveryImportButton from "@/components/DeliveryImportButton";
import PivotTable from "@/components/PivotTable";
import CPRTable from "@/components/CPRTable";
import VWAPTable from "@/components/VWAPTable";
import VolumeTable from "@/components/VolumeTable";
import SwingTable from "@/components/SwingTable";
import FibTable from "@/components/FibTable";
import {

==================================================
lib\cache\historyCache.ts
==================================================

==================================================
lib\chart\overlay\ChartCoordinateMapper.ts
==================================================

==================================================
lib\chart\overlay\index.ts
==================================================

==================================================
lib\chart\overlay\OverlayArrow.ts
==================================================
import { OverlayPoint } from "./OverlayPoint";

==================================================
lib\chart\overlay\OverlayBounds.ts
==================================================

==================================================
lib\chart\overlay\OverlayLabel.ts
==================================================

==================================================
lib\chart\overlay\OverlayLine.ts
==================================================
import { OverlayPoint } from "./OverlayPoint";

==================================================
lib\chart\overlay\OverlayPoint.ts
==================================================

==================================================
lib\chart\overlay\OverlayPolygon.ts
==================================================
import { OverlayPoint } from "./OverlayPoint";

==================================================
lib\chart\overlay\OverlayRectangle.ts
==================================================

==================================================
lib\chart\overlay\OverlayStyle.ts
==================================================

==================================================
lib\chart\overlay\OverlayTextStyle.ts
==================================================

==================================================
lib\chart\overlay\OverlayViewport.ts
==================================================

==================================================
lib\chart\overlay\PriceCoordinateMapper.ts
==================================================

==================================================
lib\chart\overlay\TimeCoordinateMapper.ts
==================================================

==================================================
lib\chart\render\ArrowRenderer.ts
==================================================

==================================================
lib\chart\render\BaseRenderer.ts
==================================================

==================================================
lib\chart\render\BoxRenderer.ts
==================================================

==================================================
lib\chart\render\buildRenderPlan.ts
==================================================
import { PatternResult } from "@/lib/pattern/types";
import { RenderPlan } from "./RenderPlan";
import { generateSignal } from "@/lib/pattern/signalEngine";

==================================================
lib\chart\render\LabelRenderer.ts
==================================================
import { PatternResult } from "@/lib/pattern/types";
import { RenderPlan } from "./RenderPlan";
import { generateSignal } from "@/lib/pattern/signalEngine";

==================================================
lib\chart\render\LineRenderer.ts
==================================================
import { PatternResult } from "@/lib/pattern/types";
import { RenderPlan } from "./RenderPlan";
import { generateSignal } from "@/lib/pattern/signalEngine";

==================================================
lib\chart\render\MarkerRenderer.ts
==================================================
import { PatternResult } from "@/lib/pattern/types";
import { RenderPlan } from "./RenderPlan";
import { generateSignal } from "@/lib/pattern/signalEngine";

==================================================
lib\chart\render\PatternDrawing.ts
==================================================

==================================================
lib\chart\render\PatternSeriesManager.ts
==================================================
import { IChartApi } from "lightweight-charts";

==================================================
lib\chart\render\PolygonRenderer.ts
==================================================
import { IChartApi } from "lightweight-charts";

==================================================
lib\chart\render\PriceRenderer.ts
==================================================
import { IChartApi } from "lightweight-charts";

==================================================
lib\chart\render\Renderer.ts
==================================================
import { IChartApi } from "lightweight-charts";

==================================================
lib\chart\render\RenderPlan.ts
==================================================

==================================================
lib\chart\render\RenderTypes.ts
==================================================

==================================================
lib\chart\render\Theme.ts
==================================================

==================================================
lib\chart\render\useRenderPlan.ts
==================================================
import { useMemo } from "react";
import { PatternResult } from "@/lib/pattern/types";
import { buildRenderPlan } from "./buildRenderPlan";

==================================================
lib\chart\CandlestickChart.tsx
==================================================
import {
import { useEffect, useRef, useState } from "react";
import StockSearchPopup from "@/components/StockSearch/StockSearchPopup";
import { setCurrentSymbol } from "@/lib/live/symbolManager";
import { subscribe } from "@/lib/live/liveEngine";
import { candleEngine, subscribeCandles } from "@/lib/live/candleEngine";
import { subscribeOHLC } from "@/lib/live/ohlcEngine";
import { aggregateCandles } from "@/lib/history/aggregateCandles";
import { detectPatterns } from "@/lib/patterns/analyzePattern";
import PatternOverlay from "@/lib/chart/PatternOverlay";
import PatternInfoOverlay from "@/lib/chart/PatternInfoOverlay";
import PatternLabels from "@/lib/chart/PatternLabels";
import { getPatternMetadata } from "@/lib/pattern/patternMetadata";
import type { PatternResult } from "@/lib/pattern/types";

==================================================
lib\chart\ChartOverlay.tsx
==================================================
import SDKPatternRenderer from "./SDKPatternRenderer";
import { IChartApi } from "lightweight-charts";
import { PatternResult } from "@/lib/pattern/types";
import { useRenderPlan } from "./render/useRenderPlan";

==================================================
lib\chart\coordinateEngine.ts
==================================================
import {
import {

==================================================
lib\chart\CrosshairInfo.tsx
==================================================

==================================================
lib\chart\DrawingCanvas.tsx
==================================================

==================================================
lib\chart\PatternAnnotations.tsx
==================================================
import PatternCanvas,{

==================================================
lib\chart\PatternBadge.tsx
==================================================

==================================================
lib\chart\PatternBreakout.tsx
==================================================

==================================================
lib\chart\PatternCanvas.tsx
==================================================
import PatternMarker from "./PatternMarker";

==================================================
lib\chart\PatternInfoCard.tsx
==================================================
import PatternBadge from "./PatternBadge";

==================================================
lib\chart\PatternInfoOverlay.tsx
==================================================
import { PatternResult } from "@/lib/pattern/types";
import { getPatternMetadata } from "@/lib/pattern/patternMetadata";

==================================================
lib\chart\PatternLabels.tsx
==================================================

==================================================
lib\chart\PatternLegend.tsx
==================================================

==================================================
lib\chart\PatternMarker.tsx
==================================================

==================================================
lib\chart\PatternMeasurements.tsx
==================================================

==================================================
lib\chart\PatternOverlay.tsx
==================================================
import {
import {
import {

==================================================
lib\chart\PatternPanel.tsx
==================================================
import { PatternResult } from "@/lib/pattern/types";

==================================================
lib\chart\PatternPriceLabels.tsx
==================================================
import { PatternResult } from "@/lib/pattern/types";

==================================================
lib\chart\PatternProjection.tsx
==================================================

==================================================
lib\chart\PatternRenderer.tsx
==================================================
import PatternBreakout from "./PatternBreakout";
import PatternProjection from "./PatternProjection";
import PatternRiskReward from "./PatternRiskReward";
import PatternTarget from "./PatternTarget";

==================================================
lib\chart\PatternRiskReward.tsx
==================================================

==================================================
lib\chart\PatternTarget.tsx
==================================================

==================================================
lib\chart\PatternToolbar.tsx
==================================================

==================================================
lib\chart\PriceLabel.tsx
==================================================

==================================================
lib\chart\PriceLabelGroup.tsx
==================================================
import PriceLabel from "./PriceLabel";

==================================================
lib\chart\SDKChartOverlay.tsx
==================================================
import SDKPatternRenderer from "./SDKPatternRenderer";
import {
import {

==================================================
lib\chart\SDKPatternRenderer.tsx
==================================================
import { useEffect } from "react";
import { IChartApi, LineSeries } from "lightweight-charts";
import { RenderPlan } from "./render/RenderPlan";
import { PatternSeriesManager } from "./render/PatternSeriesManager";

==================================================
lib\chart\SwingLabels.tsx
==================================================

==================================================
lib\chart\SwingOverlay.tsx
==================================================

==================================================
lib\chart\TimeframeSelector.tsx
==================================================

==================================================
lib\chart\useCrosshair.ts
==================================================
import {

==================================================
lib\corporate\bse.ts
==================================================

==================================================
lib\corporate\cache.ts
==================================================
import { CorporateAnnouncement } from "./types";

==================================================
lib\corporate\dedupe.ts
==================================================
import { adminDb } from "@/lib/firebase-admin";

==================================================
lib\corporate\filter.ts
==================================================
import { STOCK_UNIVERSE } from "@/lib/universe";
import { CorporateAnnouncement } from "./types";

==================================================
lib\corporate\ingest-bse.ts
==================================================

==================================================
lib\corporate\ingest-nse.ts
==================================================

==================================================
lib\corporate\normalize.ts
==================================================

==================================================
lib\corporate\nse.ts
==================================================

==================================================
lib\corporate\source.ts
==================================================
import { adminDb } from "@/lib/firebase-admin";
import { CorporateAnnouncement } from "./types";
import { filterUniverse } from "./filter";

==================================================
lib\corporate\types.ts
==================================================

==================================================
lib\data\heatmapEngine.ts
==================================================

==================================================
lib\data\liveMarketStream.ts
==================================================

==================================================
lib\data\liveUIBridge.ts
==================================================

==================================================
lib\data\scannerStore.ts
==================================================

==================================================
lib\data\stockRouter.ts
==================================================
import { learningEngine } from "@/lib/engine/learningEngine";
import { analyzeAllPatterns } from "@/lib/pattern/patternEngine";
import { getLivePattern } from "@/lib/pattern/livePatternEngine";
import { detectMarketRegime } from "@/lib/pattern/marketRegime";
import { scorePattern } from "@/lib/pattern/patternScore";
import { institutionalFilter } from "@/lib/pattern/institutionalFilter";
import { predictNextMove } from "@/lib/pattern/predictionEngine";
import { scannerStore } from "./scannerStore";

==================================================
lib\engine\aiStrategyEngine.ts
==================================================
import { learningEngine } from "./learningEngine";
import { performanceEngine } from "./performanceEngine";

==================================================
lib\engine\executionEngine.ts
==================================================

==================================================
lib\engine\learningEngine.ts
==================================================
import { performanceEngine } from "./performanceEngine";

==================================================
lib\engine\performanceDashboard.ts
==================================================
import { performanceEngine } from "./performanceEngine";

==================================================
lib\engine\performanceEngine.ts
==================================================

==================================================
lib\engine\statisticsEngine.ts
==================================================
import { performanceEngine } from "./performanceEngine";

==================================================
lib\engine\tradeFeedbackEngine.ts
==================================================
import { performanceEngine } from "./performanceEngine";
import { learningEngine } from "./learningEngine";

==================================================
lib\engine\trainingEngine.ts
==================================================
import { tradeFeedbackEngine } from "./tradeFeedbackEngine";

==================================================
lib\eod\eodFinalize.ts
==================================================
import { getLiveCandle } from "@/lib/liveChart/liveCandleStore";

==================================================
lib\export\historyWorkbook.ts
==================================================
import ExcelJS from "exceljs";

==================================================
lib\history\aggregateCandles.ts
==================================================

==================================================
lib\history\deltaSync.ts
==================================================

==================================================
lib\history\historyMetrics.ts
==================================================

==================================================
lib\history\historyProgress.ts
==================================================

==================================================
lib\history\historyWriter.ts
==================================================
import { finalizeEODCandle } from "@/lib/eod/eodFinalize";

==================================================
lib\history\importCsv.ts
==================================================
import {
import { db } from "@/lib/firebase";

==================================================
lib\kite\historical.ts
==================================================
import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "./tokenCache";

==================================================
lib\kite\tokenCache.ts
==================================================
import { adminDb } from "@/lib/firebase-admin";

==================================================
lib\live\candleEngine.ts
==================================================
import {
import { db } from "@/lib/firebase";

==================================================
lib\live\liveBootstrap.ts
==================================================
import { liveEngine } from "./liveEngine";

==================================================
lib\live\liveEngine.ts
==================================================
import { candleEngine } from "./candleEngine";

==================================================
lib\live\liveTypes.ts
==================================================

==================================================
lib\live\ohlcEngine.ts
==================================================
import { LiveTick } from "./liveTypes";

==================================================
lib\live\symbolManager.ts
==================================================
import { subscribe } from "./liveEngine";
import { resolveToken } from "../tokenResolver";

==================================================
lib\liveChart\liveCandleStore.ts
==================================================

==================================================
lib\liveChart\liveChartSync.ts
==================================================
import { getLiveCandle } from "./liveCandleStore";

==================================================
lib\liveChart\realtimeOHLC.ts
==================================================
import { getLiveCandle,setLiveCandle } from "./liveCandleStore";

==================================================
lib\liveChart\realtimeVolume.ts
==================================================
import { getLiveCandle, setLiveCandle } from "./liveCandleStore";

==================================================
lib\market\marketSession.ts
==================================================

==================================================
lib\market\marketStore.ts
==================================================

==================================================
lib\market\normalizeMarketData.ts
==================================================

==================================================
lib\pattern\buildPatternLabels.ts
==================================================
import { PatternResult } from "./types";
import { getPatternMetadata } from "./patternMetadata";

==================================================
lib\pattern\channelEngine.ts
==================================================
import {
import {

==================================================
lib\pattern\cupHandleEngine.ts
==================================================
import {

==================================================
lib\pattern\doubleBottomEngine.ts
==================================================
import {

==================================================
lib\pattern\doubleTopEngine.ts
==================================================
import {

==================================================
lib\pattern\DrawingBuilder.ts
==================================================
import { PatternResult } from "./types";
import { PatternDrawing } from "@/lib/chart/render/PatternDrawing";

==================================================
lib\pattern\flagEngine.ts
==================================================
import {
import {

==================================================
lib\pattern\geometry.ts
==================================================
import {

==================================================
lib\pattern\headShoulder.ts
==================================================
import {

==================================================
lib\pattern\headShoulderEngine.ts
==================================================
import {

==================================================
lib\pattern\institutionalFilter.ts
==================================================
import { PatternResult } from "./types";
import { MarketRegime } from "./marketRegime";

==================================================
lib\pattern\learningEngine.ts
==================================================

==================================================
lib\pattern\livePatternEngine.ts
==================================================
import { PatternResult } from "./types";

==================================================
lib\pattern\marketRegime.ts
==================================================
import { Candle } from "./types";

==================================================
lib\pattern\PatternDrawing.ts
==================================================

==================================================
lib\pattern\PatternDrawingFactory.ts
==================================================
import { PatternResult } from "./types";
import { PatternDrawing } from "@/lib/chart/render/PatternDrawing";
import { DrawingBuilder } from "./DrawingBuilder";

==================================================
lib\pattern\patternEngine.ts
==================================================
import { buildPatternDrawing } from "./PatternDrawingFactory";
import {
import {
import {
import {
import {
import {
import {
import {
import {
import {

==================================================
lib\pattern\patternMetadata.ts
==================================================
import { PatternType } from "./types";

==================================================
lib\pattern\patternScore.ts
==================================================
import {

==================================================
lib\pattern\patternTypes.ts
==================================================
import {

==================================================
lib\pattern\predictionEngine.ts
==================================================
import { PatternResult } from "./types";
import { MarketRegime } from "./marketRegime";

==================================================
lib\pattern\renderPlanNormalizer.ts
==================================================

==================================================
lib\pattern\signalEngine.ts
==================================================
import { PatternResult } from "./types";

==================================================
lib\pattern\swing.ts
==================================================
import {

==================================================
lib\pattern\swingEngine.ts
==================================================
import {

==================================================
lib\pattern\trendlineEngine.ts
==================================================
import {
import {

==================================================
lib\pattern\triangleEngine.ts
==================================================
import {
import {

==================================================
lib\pattern\types.ts
==================================================
import { PatternDrawing } from "@/lib/chart/render/PatternDrawing";

==================================================
lib\pattern\wedgeEngine.ts
==================================================
import {
import {

==================================================
lib\patternEngine\patternLoader.ts
==================================================
import { analyzePattern } from "@/lib/pattern/patternEngine";

==================================================
lib\patterns\analyzePattern.ts
==================================================
import { analyzePattern } from "@/lib/pattern/patternEngine";

==================================================
lib\scheduler\eodScheduler.ts
==================================================

==================================================
lib\sdk\integration\DrawingBridge.ts
==================================================
import { PatternResult } from "@/lib/pattern/types";
import { buildPatternDrawing } from "@/lib/pattern/PatternDrawingFactory";

==================================================
lib\server\bootstrap\liveServerBootstrap.ts
==================================================
import { adminDb } from "@/lib/firebase-admin";
import { kiteLiveService } from "@/lib/server/live/KiteLiveService";
import { getUniverseTokens } from "@/lib/tokenResolver/universeTokenResolver";
import { startEodScheduler } from "@/lib/scheduler/eodScheduler";

==================================================
lib\server\live\KiteLiveService.ts
==================================================
import { KiteTicker } from "kiteconnect";
import { liveTickHub } from "@/lib/server/stream/LiveTickHub";
import { getSymbolFromToken } from "@/lib/tokenResolver/tokenLookup";

==================================================
lib\server\stream\LiveTickHub.ts
==================================================

==================================================
lib\system\systemMode.ts
==================================================

==================================================
lib\tokenResolver\bootstrap.ts
==================================================
import path from "path";
import { reload, isLoaded } from "./tokenResolver";

==================================================
lib\tokenResolver\cache.ts
==================================================
import { InstrumentInfo, SymbolMap, TokenMap } from "./types";

==================================================
lib\tokenResolver\csvLoader.ts
==================================================
import fs from "fs";
import path from "path";
import { InstrumentInfo } from "./types";

==================================================
lib\tokenResolver\historicalResolver.ts
==================================================
import { ensureTokenResolver } from "./bootstrap";
import { resolveToken } from "./tokenResolver";
import { InstrumentInfo } from "./types";

==================================================
lib\tokenResolver\index.ts
==================================================

==================================================
lib\tokenResolver\liveResolver.ts
==================================================
import { ensureTokenResolver } from "./bootstrap";
import { resolveToken } from "./tokenResolver";

==================================================
lib\tokenResolver\serverTokenResolver.ts
==================================================
import { loadInstrumentCsv } from "./csvLoader";

==================================================
lib\tokenResolver\tokenLookup.ts
==================================================
import { loadInstrumentCsv } from "./csvLoader";

==================================================
lib\tokenResolver\tokenResolver.ts
==================================================
import {
import { InstrumentInfo } from "./types";

==================================================
lib\tokenResolver\types.ts
==================================================

==================================================
lib\tokenResolver\universeTokenResolver.ts
==================================================
import fs from "fs";
import path from "path";
import { loadInstrumentCsv } from "./csvLoader";

==================================================
lib\tokenResolver\websocketResolver.ts
==================================================
import { ensureTokenResolver } from "./bootstrap";
import { resolveSymbol, resolveToken } from "./tokenResolver";

==================================================
lib\universe\types.ts
==================================================

==================================================
lib\universe\universeService.ts
==================================================
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UniverseStock } from "./types";

==================================================
lib\firebase-admin.ts
==================================================
import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

==================================================
lib\firebase.ts
==================================================
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

==================================================
lib\kite.ts
==================================================
import { KiteConnect } from "kiteconnect";

==================================================
lib\sendWhatsApp.ts
==================================================

==================================================
lib\universe.ts
==================================================

==================================================
hooks\index.ts
==================================================

==================================================
hooks\useChartLiveSync.ts
==================================================
import { useMemo } from "react";
import { synchronizeChartCandles } from "@/lib/liveChart/liveChartSync";

==================================================
hooks\useDeliveryHistory.ts
==================================================
import { useEffect, useState } from "react";
import {
import { db } from "@/lib/firebase";

==================================================
hooks\useHistory.ts
==================================================
import { useEffect, useState } from "react";
import { getHistoryData } from "@/services/firebaseHistory";

==================================================
hooks\useKiteData.ts
==================================================
import { useEffect, useState } from "react";
import { fetchMarketData } from "@/services/marketService";
import { KiteApiResponse } from "@/types/market";

==================================================
hooks\useMacroDashboard.ts
==================================================
import { useEffect, useState } from "react";

==================================================
hooks\useMarketSnapshot.ts
==================================================
import { useKiteData } from "@/hooks/useKiteData";
import {

==================================================
hooks\useMarketStructure.ts
==================================================
import {

==================================================
hooks\usePatternHistory.ts
==================================================
import { useMemo } from "react";
import { detectPatterns } from "@/lib/patternEngine/patternLoader";

==================================================
hooks\usePivotStructure.ts
==================================================

==================================================
hooks\useSelectedMarketStructure.ts
==================================================
import {

==================================================
hooks\useUniverse.ts
==================================================
import { useEffect, useState } from "react";
import { getUniverse } from "@/lib/universe/universeService";
import { UniverseStock } from "@/lib/universe/types";

==================================================
services\firebaseHistory.ts
==================================================
import {
import { db } from "@/lib/firebase";

==================================================
services\firebaseUniverse.ts
==================================================
import {
import { db } from "@/lib/firebase";

==================================================
services\marketService.ts
==================================================
import { KiteApiResponse } from "@/types/market";
import { getSharedMarketData } from "@/lib/market/marketStore";
