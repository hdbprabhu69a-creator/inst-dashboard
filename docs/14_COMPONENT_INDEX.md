
app\chart-analysis\page.tsx
    const activeSymbol = symbol.trim();

app\chart-analysis\page.tsx
    const res = await fetch(

app\chart-analysis\page.tsx
    const json = await res.json();

app\chart-analysis\page.tsx
    const [candles, setCandles] = useState<any[]>([]);

app\chart-analysis\page.tsx
    export default function ChartAnalysisPage() {

app\chart-analysis\page.tsx
    const [interval, setInterval] = useState<Interval>("D");

app\chart-analysis\page.tsx
    const [symbol, setSymbol] = useState("SBIN");

app\components\InstitutionalDashboard.tsx
    const [mode, setMode] = useState<"GRID" | "TRADER">("GRID");

app\components\InstitutionalDashboard.tsx
    export default function InstitutionalDashboard() {

app\components\LiveChart.tsx
    const [active, setActive] = useState<any>(null);

app\components\LiveChart.tsx
    const [drawing, setDrawing] = useState<any>(null);

app\components\LiveChart.tsx
    const chart = createChart(containerRef.current, {

app\components\LiveChart.tsx
    export default function LiveChart() {

app\components\LiveChart.tsx
    const containerRef = useRef<HTMLDivElement>(null);

app\components\LiveChart.tsx
    const chartRef = useRef<IChartApi | null>(null);

app\components\LiveDashboard.tsx
    const [stats, setStats] = useState<any>({});

app\components\LiveDashboard.tsx
    const interval = setInterval(() => {

app\components\LiveDashboard.tsx
    const [heatmap, setHeatmap] = useState<any[]>([]);

app\components\LiveDashboard.tsx
    export default function LiveDashboard() {

app\components\LiveDashboard.tsx
    const [mode, setMode] = useState<"GRID" | "TRADER">("GRID");

app\components\LiveScanner.tsx
    const [data, setData] = useState<any[]>([]);

app\components\LiveScanner.tsx
    export default function LiveScanner() {

app\components\ProTradingTerminal.tsx
    const [stats, setStats] = useState<any>({});

app\components\ProTradingTerminal.tsx
    const interval = setInterval(() => {

app\components\ProTradingTerminal.tsx
    export default function ProTradingTerminal() {

app\components\ProTradingTerminal.tsx
    const [heatmap, setHeatmap] = useState<any[]>([]);

app\heatmap\page.tsx
    const response = await fetch("/api/sector-heatmap");

app\heatmap\page.tsx
    const result = await response.json();

app\heatmap\page.tsx
    const sorted = (result.sectors || [])

app\heatmap\page.tsx
    export default function HeatMapPage() {

app\heatmap\page.tsx
    const [sectors, setSectors] = useState<any[]>([]);

app\heatmap\page.tsx
    const [loading, setLoading] = useState(true);

app\institutional-desk\page.tsx
    const [activePage, setActivePage] =

app\institutional-desk\page.tsx
    export default function InstitutionalDesk() {

app\layout.tsx
    export const metadata: Metadata = {

app\layout.tsx
    export default function RootLayout({

app\market-heatmap\page.tsx
    export default function MarketHeatMapPage() {

app\market-heatmap\page.tsx
    const [sectors, setSectors] =

app\market-heatmap\page.tsx
    const result =

app\market-heatmap\page.tsx
    const [loading, setLoading] =

app\market-heatmap\page.tsx
    const response =

app\page.tsx
    const requestToken =

app\page.tsx
    const params =

app\page.tsx
    export default function Home() {

app\page_BACKUP_FINAL.tsx
    const requestToken =

app\page_BACKUP_FINAL.tsx
    const params =

app\page_BACKUP_FINAL.tsx
    export default function Home() {

app\scanner\page.tsx
    const result =

app\scanner\page.tsx
    const sector =

app\scanner\page.tsx
    const sectors =

app\scanner\page.tsx
    const [scanner, setScanner] =

app\scanner\page.tsx
    const [filters, setFilters] =

app\scanner\page.tsx
    const response =

app\scanner\page.tsx
    const [running, setRunning] =

app\scanner\page.tsx
    const [stocks, setStocks] =

app\scanner\page.tsx
    const [results, setResults] =

app\scanner\page.tsx
    const [loading, setLoading] =

app\scanner\page.tsx
    export default function ScannerPage() {

app\scanner\page.tsx
    const result =

app\scanner\page.tsx
    const response =

app\sector\[sector]\page.tsx
    export default function SectorStocksPage({

app\sector\[sector]\page.tsx
    const result =

app\sector\[sector]\page.tsx
    const [loading, setLoading] =

app\sector\[sector]\page.tsx
    const response =

app\sector\[sector]\page.tsx
    const { sector } = use(params);

app\sector\[sector]\page.tsx
    const [stocks, setStocks] =

app\sector-heatmap\page.tsx
    const response =

app\sector-heatmap\page.tsx
    const result =

app\sector-heatmap\page.tsx
    const sortedSectors =

app\sector-heatmap\page.tsx
    export default function SectorHeatMapPage() {

app\sector-heatmap\page.tsx
    const [sectors, setSectors] =

app\sector-heatmap\page.tsx
    const [loading, setLoading] =

app\watchlist\page.tsx
    const c =

app\watchlist\page.tsx
    const counts =

app\watchlist\page.tsx
    const searchMatch =

app\watchlist\page.tsx
    const cmpColor=(r:Row)=>

app\watchlist\page.tsx
    const V:any = {

app\watchlist\page.tsx
    const scoreColor=(s:number)=>

app\watchlist\page.tsx
    const pivotColor=(

app\watchlist\page.tsx
    const [search,setSearch] =

app\watchlist\page.tsx
    const [selectedFilters,setSelectedFilters] =

app\watchlist\page.tsx
    const [runFilters,setRunFilters] =

app\watchlist\page.tsx
    export default function WatchlistPage() {

app\watchlist\page.tsx
    const [rows,setRows] =

app\watchlist\page.tsx
    const [prev,setPrev] =

app\watchlist\page.tsx
    const [scannerType,setScannerType] =

app\watchlist\page.tsx
    const r =

app\watchlist\page.tsx
    const j =

app\watchlist\page.tsx
    const filtered =

app\watchlist\page.tsx
    useState("Buy Zone");  const [loading,setLoading] =

app\watchlist\page.tsx
    const [time,setTime] =

app\watchlist\page.tsx
    const i =

components\BrokerConnectionManager.tsx
    const interval =

components\BrokerConnectionManager.tsx
    const time =

components\BrokerConnectionManager.tsx
    const month =

components\BrokerConnectionManager.tsx
    const current =

components\BrokerConnectionManager.tsx
    const statusConfig = {

components\BrokerConnectionManager.tsx
    const reconnect = () => {

components\BrokerConnectionManager.tsx
    const updateTime = () => {

components\BrokerConnectionManager.tsx
    const [statusTime, setStatusTime] =

components\BrokerConnectionManager.tsx
    const apiKey =

components\BrokerConnectionManager.tsx
    const day =

components\BrokerConnectionManager.tsx
    const weekday =

components\BrokerConnectionManager.tsx
    const now = new Date();

components\BrokerConnectionManager.tsx
    export default function BrokerConnectionManager({

components\BrokerConnectionManager_BACKUP.tsx
    const interval =

components\BrokerConnectionManager_BACKUP.tsx
    const time =

components\BrokerConnectionManager_BACKUP.tsx
    export default function BrokerConnectionManager({

components\BrokerConnectionManager_BACKUP.tsx
    const current =

components\BrokerConnectionManager_BACKUP.tsx
    const statusConfig = {

components\BrokerConnectionManager_BACKUP.tsx
    const reconnect = () => {

components\BrokerConnectionManager_BACKUP.tsx
    const weekday =

components\BrokerConnectionManager_BACKUP.tsx
    const day =

components\BrokerConnectionManager_BACKUP.tsx
    const month =

components\BrokerConnectionManager_BACKUP.tsx
    const now = new Date();

components\BrokerConnectionManager_BACKUP.tsx
    const apiKey =

components\BrokerConnectionManager_BACKUP.tsx
    const [statusTime, setStatusTime] =

components\BrokerConnectionManager_BACKUP.tsx
    const updateTime = () => {

components\CPRTable.tsx
    const data = [

components\CPRTable.tsx
    export default function CPRTable() {

components\DeliveryImportButton.tsx
    const data =

components\DeliveryImportButton.tsx
    const [loading, setLoading] =

components\DeliveryImportButton.tsx
    const response =

components\DeliveryImportButton.tsx
    export default function DeliveryImportButton() {

components\DeliveryImportButton.tsx
    const confirmed =

components\EodButton.tsx
    const confirmed =

components\EodButton.tsx
    const response =

components\EodButton.tsx
    export default function EodButton() {

components\EodButton.tsx
    const [loading, setLoading] =

components\EodButton.tsx
    const runEod =

components\EodButton.tsx
    const data =

components\FibTable.tsx
    const rows = [

components\FibTable.tsx
    export default function FibTable() {

components\institutional\BusinesslineFeed.tsx
    const response =

components\institutional\BusinesslineFeed.tsx
    const [activeTab, setActiveTab] =

components\institutional\BusinesslineFeed.tsx
    const interval =

components\institutional\BusinesslineFeed.tsx
    const data =

components\institutional\BusinesslineFeed.tsx
    const filteredNews =

components\institutional\BusinesslineFeed.tsx
    const TABS = [

components\institutional\BusinesslineFeed.tsx
    const cleanedNews =

components\institutional\BusinesslineFeed.tsx
    export default function BusinesslineFeed() {

components\institutional\BusinesslineFeed.tsx
    const [loading, setLoading] =

components\institutional\BusinesslineFeed.tsx
    const [news, setNews] =

components\institutional\CorporateAnnouncements.tsx
    const res = await fetch(

components\institutional\CorporateAnnouncements.tsx
    const data = await res.json();

components\institutional\CorporateAnnouncements.tsx
    const [rows, setRows] = useState<Announcement[]>([]);

components\institutional\CorporateAnnouncements.tsx
    export default function CorporateAnnouncements() {

components\institutional\CorporateAnnouncements.tsx
    const [search, setSearch] = useState("");

components\institutional\CorporateAnnouncements.tsx
    const load = async () => {

components\institutional\CorporateAnnouncements.tsx
    const filteredRows = useMemo(() => {

components\institutional\CorporateAnnouncements.tsx
    const interval = setInterval(

components\institutional\CorporateAnnouncements.tsx
    const formatDate = (

components\institutional\InstitutionalHeader.tsx
    export default function InstitutionalHeader() {

components\institutional\MacroStrip.tsx
    const json =

components\institutional\MacroStrip.tsx
    const timer =

components\institutional\MacroStrip.tsx
    const cards = [

components\institutional\MacroStrip.tsx
    const [data, setData] =

components\institutional\MacroStrip.tsx
    export default function MacroStrip() {

components\institutional\MacroStrip.tsx
    const response =

components\institutional\MacroStrip.tsx
    const [lastUpdate, setLastUpdate] =

components\institutional\MajorEventTracker.tsx
    const sorted =

components\institutional\MajorEventTracker.tsx
    const json =

components\institutional\MajorEventTracker.tsx
    const dateB =

components\institutional\MajorEventTracker.tsx
    const currentYear =

components\institutional\MajorEventTracker.tsx
    export default function MajorEventTracker() {

components\institutional\MajorEventTracker.tsx
    const dateA =

components\institutional\MajorEventTracker.tsx
    const response =

components\institutional\MajorEventTracker.tsx
    const [events, setEvents] =

components\live\LiveBootstrapClient.tsx
    export default function LiveBootstrapClient() {

components\MarketHeatMap.tsx
    const sectors =

components\MarketHeatMap.tsx
    const [stocks, setStocks] =

components\MarketHeatMap.tsx
    const sector =

components\MarketHeatMap.tsx
    const response =

components\MarketHeatMap.tsx
    const [loading, setLoading] =

components\MarketHeatMap.tsx
    const groupedStocks =

components\MarketHeatMap.tsx
    const result =

components\MarketHeatMap.tsx
    export default function MarketHeatMap() {

components\MarketSnapshot.tsx
    export default function MarketSnapshot() {

components\PivotCard.tsx
    const pivots = [

components\PivotCard.tsx
    export default function PivotCard() {

components\PivotTable.tsx
    export default function PivotTable() {

components\PivotTable.tsx
    const data = [

components\SearchBox.tsx
    const data =

components\SearchBox.tsx
    const filtered =

components\SearchBox.tsx
    const [query, setQuery] =

components\SearchBox.tsx
    export default function SearchBox() {

components\SearchBox.tsx
    const [stocks, setStocks] =

components\SearchBox.tsx
    const [results, setResults] =

components\StockSearch\StockSearch.tsx
    export default function StockSearch({

components\StockSearch\StockSearchPopup.tsx
    const filtered = useMemo(() => {

components\StockSearch\StockSearchPopup.tsx
    const q = query.toLowerCase();

components\StockSearch\StockSearchPopup.tsx
    const [query, setQuery] = useState("");

components\StockSearch\StockSearchPopup.tsx
    export default function StockSearchPopup({

components\StockSearch\StockSearchPopup.tsx
    const { stocks } = useUniverse();

components\SwingFibCard.tsx
    export default function SwingFibCard() {

components\SwingTable.tsx
    export default function SwingTable() {

components\SwingTable.tsx
    const data = [

components\SwingTable.tsx
    const months = [

components\SwingTable.tsx
    const date =

components\SwingTable.tsx
    const day =

components\UniverseViewer.tsx
    const data =

components\UniverseViewer.tsx
    const [stocks, setStocks] =

components\UniverseViewer.tsx
    export default function UniverseViewer() {

components\VerifyButton.tsx
    const expectedTC =

components\VerifyButton.tsx
    const expectedBC =

components\VerifyButton.tsx
    const actualTC =

components\VerifyButton.tsx
    const actualBC =

components\VerifyButton.tsx
    const actualDailyPivot =

components\VerifyButton.tsx
    const runVerify =

components\VerifyButton.tsx
    export default function VerifyButton() {

components\VerifyButton.tsx
    const expectedDailyPivot =

components\VerifyButton.tsx
    const round =

components\VolumeTable.tsx
    export default function VolumeTable() {

components\VWAPTable.tsx
    export default function VWAPTable() {

data\universe.tsx
    export default function VWAPTable() {

lib\chart\CandlestickChart.tsx
    const cleaned = aggregateCandles((data || [])

lib\chart\CandlestickChart.tsx
    const volume = chart.addSeries(HistogramSeries, {

lib\chart\CandlestickChart.tsx
    const candle = chart.addSeries(CandlestickSeries, {

lib\chart\CandlestickChart.tsx
    const width =

lib\chart\CandlestickChart.tsx
    const bars = cleaned.length;

lib\chart\CandlestickChart.tsx
    const last = cleaned[cleaned.length - 1] || null;

lib\chart\CandlestickChart.tsx
    const [historyVolume,setHistoryVolume]=useState(0);

lib\chart\CandlestickChart.tsx
    const [liveOHLC, setLiveOHLC] = useState({

lib\chart\CandlestickChart.tsx
    const [historyOHLC, setHistoryOHLC] = useState({

lib\chart\CandlestickChart.tsx
    const chart = createChart(chartRef.current, {

lib\chart\CandlestickChart.tsx
    const [ohlc, setOhlc] = useState({

lib\chart\CandlestickChart.tsx
    const [liveVolume,setLiveVolume]=useState(0);

lib\chart\CandlestickChart.tsx
    const togglePattern = () => {

lib\chart\CandlestickChart.tsx
    const displayOHLC =

lib\chart\CandlestickChart.tsx
    const display = last;

lib\chart\CandlestickChart.tsx
    const r=intervalBtnRef.current?.getBoundingClientRect();

lib\chart\CandlestickChart.tsx
    const displayOHLC =

lib\chart\CandlestickChart.tsx
    const result = detectPatterns(cleanedCandlesRef.current);

lib\chart\CandlestickChart.tsx
    const live = liveCandleRef.current;

lib\chart\CandlestickChart.tsx
    const opts = chart.timeScale().options();

lib\chart\CandlestickChart.tsx
    const resize = () => {

lib\chart\CandlestickChart.tsx
    const last = candles[candles.length-1];

lib\chart\CandlestickChart.tsx
    const hovered =

lib\chart\CandlestickChart.tsx
    const t =

lib\chart\CandlestickChart.tsx
    const [pattern,setPattern]=useState<PatternResult | null>(null);

lib\chart\CandlestickChart.tsx
    const disposed = useRef(false);

lib\chart\CandlestickChart.tsx
    const candleUnsub = useRef<null | (() => void)>(null);

lib\chart\CandlestickChart.tsx
    const ohlcUnsub = useRef<null | (() => void)>(null);

lib\chart\CandlestickChart.tsx
    const visibleRangeRef = useRef<any>(null);

lib\chart\CandlestickChart.tsx
    const liveCandleRef = useRef<Candle | null>(null);

lib\chart\CandlestickChart.tsx
    const lastCandleRef = useRef<Candle | null>(null);

lib\chart\CandlestickChart.tsx
    const chartInstance = useRef<any>(null);

lib\chart\CandlestickChart.tsx
    const chartRef = useRef<HTMLDivElement>(null);

lib\chart\CandlestickChart.tsx
    export default function CandlestickChart({

lib\chart\CandlestickChart.tsx
    const tickUnsub = useRef<null | (() => void)>(null);

lib\chart\CandlestickChart.tsx
    const volumeSeries = useRef<any>(null);

lib\chart\CandlestickChart.tsx
    const candleSeries = useRef<any>(null);

lib\chart\CandlestickChart.tsx
    const cleanedCandlesRef = useRef<any[]>([]);

lib\chart\CandlestickChart.tsx
    const [menuPos,setMenuPos]=useState({left:0,top:0});

lib\chart\CandlestickChart.tsx
    const intervalBtnRef = useRef<HTMLButtonElement>(null);

lib\chart\CandlestickChart.tsx
    const [patternEnabled,setPatternEnabled]=useState(false);

lib\chart\CandlestickChart.tsx
    const isHoveringRef = useRef(false);

lib\chart\CandlestickChart.tsx
    const historyCandlesRef = useRef<any[]>([]);

lib\chart\CandlestickChart.tsx
    const firstLoadRef = useRef(true);

lib\chart\CandlestickChart.tsx
    const barSpacingRef = useRef<number>(10);

lib\chart\CandlestickChart.tsx
    const logicalWidthRef = useRef<number | null>(null);

lib\chart\CandlestickChart.tsx
    const [showIntervalMenu,setShowIntervalMenu]=useState(false);

lib\chart\CandlestickChart.tsx
    const [searchOpen,setSearchOpen]=useState(false);

lib\chart\CandlestickChart.tsx
    /* const zoomStateRef = useRef({

lib\chart\ChartOverlay.tsx
    const plan = useRenderPlan(pattern);

lib\chart\ChartOverlay.tsx
    export default function ChartOverlay({

lib\chart\CrosshairInfo.tsx
    const green=

lib\chart\CrosshairInfo.tsx
    export default function CrosshairInfo({

lib\chart\DrawingCanvas.tsx
    const green=

lib\chart\DrawingCanvas.tsx
    export default function CrosshairInfo({

lib\chart\PatternAnnotations.tsx
    export default function PatternAnnotations({

lib\chart\PatternBadge.tsx
    export default function PatternBadge({

lib\chart\PatternBreakout.tsx
    export default function PatternBreakout({

lib\chart\PatternCanvas.tsx
    export default function PatternCanvas({

lib\chart\PatternInfoCard.tsx
    export default function PatternInfoCard({

lib\chart\PatternInfoOverlay.tsx
    const meta = getPatternMetadata(pattern.pattern);

lib\chart\PatternInfoOverlay.tsx
    export default function PatternInfoOverlay({

lib\chart\PatternLabels.tsx
    export default function PatternLabels({

lib\chart\PatternLegend.tsx
    export default function PatternLegend(){

lib\chart\PatternMarker.tsx
    export default function PatternMarker({

lib\chart\PatternMeasurements.tsx
    export default function PatternMarker({

lib\chart\PatternOverlay.tsx
    const line =

lib\chart\PatternOverlay.tsx
    const shape =

lib\chart\PatternOverlay.tsx
    const projection =

lib\chart\PatternOverlay.tsx
    const projectionData = [

lib\chart\PatternOverlay.tsx
    const shapeData = [...pattern.points]

lib\chart\PatternOverlay.tsx
    const first = pattern.points[0].swing;

lib\chart\PatternOverlay.tsx
    const last  = pattern.points[pattern.points.length-1].swing;

lib\chart\PatternOverlay.tsx
    const lineNames = getLineLabels(pattern);

lib\chart\PatternOverlay.tsx
    const uiLabels:any[] = [];

lib\chart\PatternOverlay.tsx
    const labels: Label[] =

lib\chart\PatternOverlay.tsx
    const drawHorizontal = (

lib\chart\PatternOverlay.tsx
    export default function PatternOverlay({

lib\chart\PatternOverlay.tsx
    const created: any[] = [];

lib\chart\PatternOverlay.tsx
    const line =

lib\chart\PatternOverlay.tsx
    const drawProjection = (

lib\chart\PatternOverlay.tsx
    const lastPoint =

lib\chart\PatternOverlay.tsx
    const first =

lib\chart\PatternOverlay.tsx
    const last =

lib\chart\PatternPanel.tsx
    export default function PatternPanel({

lib\chart\PatternPriceLabels.tsx
    export default function PatternPanel({

lib\chart\PatternProjection.tsx
    const direction=

lib\chart\PatternProjection.tsx
    export default function PatternProjection({

lib\chart\PatternRenderer.tsx
    export default function PatternRenderer({

lib\chart\PatternRiskReward.tsx
    const risk=

lib\chart\PatternRiskReward.tsx
    const rr=

lib\chart\PatternRiskReward.tsx
    export default function PatternRiskReward({

lib\chart\PatternRiskReward.tsx
    const reward=

lib\chart\PatternTarget.tsx
    export default function PatternTarget({

lib\chart\PatternToolbar.tsx
    const tools=[

lib\chart\PatternToolbar.tsx
    export default function PatternToolbar(){

lib\chart\PriceLabel.tsx
    export default function PriceLabel({

lib\chart\PriceLabelGroup.tsx
    export default function PriceLabelGroup({

lib\chart\SDKChartOverlay.tsx
    export default function SDKChartOverlay({

lib\chart\SDKPatternRenderer.tsx
    const marker = chart.addSeries(LineSeries, {

lib\chart\SDKPatternRenderer.tsx
    const s = chart.addSeries(LineSeries, {

lib\chart\SDKPatternRenderer.tsx
    export default function SDKPatternRenderer({

lib\chart\SwingLabels.tsx
    export default function SwingLabels({

lib\chart\SwingOverlay.tsx
    export default function SwingOverlay({

lib\chart\SwingOverlay.tsx
    const SYMBOLS={

lib\chart\SwingOverlay.tsx
    const COLORS={

lib\chart\TimeframeSelector.tsx
    const items: Interval[] = ["D", "W", "M"];

lib\chart\TimeframeSelector.tsx
    export default function TimeframeSelector({

src\context\SelectedStockContext.tsx
    const data =

src\context\SelectedStockContext.tsx
    const context =

src\context\SelectedStockContext.tsx
    const snapshot =

src\context\SelectedStockContext.tsx
    const SelectedStockContext =

src\context\SelectedStockContext.tsx
    const docRef =
