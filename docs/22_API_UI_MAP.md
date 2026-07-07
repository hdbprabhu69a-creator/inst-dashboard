
app\api\alerts\whatsapp\route.ts
Line 17
const response = await fetch(

app\api\businessline-rss\route.ts
Line 8
await fetch(

app\api\eod-refresh\route.ts
Line 123
await fetch(

app\api\eod-refresh\route.ts
Line 124
`${baseUrl}/api/market-structure-bulk-v2`

app\api\eod-refresh\route.ts
Line 150
await fetch(

app\api\eod-refresh\route.ts
Line 151
`${baseUrl}/api/delivery-bulk`

app\api\export-csv\route.ts
Line 6
await fetch(

app\api\export-csv\route.ts
Line 7
"http://localhost:3000/api/market-structure-csv",

app\api\jobs\businessline-news\route.ts
Line 7
const response = await fetch(

app\api\kite\populate-tokens\route.ts
Line 2
import axios from "axios";

app\api\kite\populate-tokens\route.ts
Line 47
const response = await axios.get(

app\api\market-structure\generate-all\route.ts
Line 8
await fetch(

app\api\market-structure\generate-all\route.ts
Line 9
`${process.env.NEXT_PUBLIC_BASE_URL}/api/market-structure/save`

app\api\market-structure-audit\route.backup.ts
Line 6
await fetch(

app\api\market-structure-audit\route.backup.ts
Line 7
"http://localhost:3000/api/market-structure-csv",

app\api\scan-universe\route.ts
Line 8
await fetch(

app\api\scan-universe\route.ts
Line 9
`${process.env.NEXT_PUBLIC_BASE_URL}/api/heatmap`

app\api\telegram-buyzone\route.ts
Line 130
await fetch(

app\api\token\route.ts
Line 2
import axios from "axios";

app\api\token\route.ts
Line 42
await axios.post(

app\chart-analysis\page.tsx
Line 47
const res = await fetch(

app\chart-analysis\page.tsx
Line 48
`/api/history?symbol=${encodeURIComponent(activeSymbol)}&interval=${interval}`

app\heatmap\page.tsx
Line 15
const response = await fetch("/api/sector-heatmap");

app\market-heatmap\page.tsx
Line 20
await fetch(

app\market-heatmap\page.tsx
Line 21
"/api/sector-heatmap"

app\page.tsx
Line 51
`/api/token?request_token=${requestToken}`

app\page.tsx
Line 159
href="/api/market-structure-audit"

app\page_BACKUP_FINAL.tsx
Line 51
`/api/token?request_token=${requestToken}`

app\page_BACKUP_FINAL.tsx
Line 118
href="/api/market-structure-audit"

app\scanner\page.tsx
Line 56
await fetch(

app\scanner\page.tsx
Line 57
"/api/scanner"

app\scanner\page.tsx
Line 94
await fetch(

app\scanner\page.tsx
Line 95
"/api/scanner",

app\sector\[sector]\page.tsx
Line 28
await fetch(

app\sector\[sector]\page.tsx
Line 29
`/api/sector-stocks?sector=${sector}`

app\sector-heatmap\page.tsx
Line 21
await fetch(

app\sector-heatmap\page.tsx
Line 22
"/api/sector-heatmap"

app\watchlist\page.tsx
Line 90
await fetch(

app\watchlist\page.tsx
Line 91
"/api/watchlist"

hooks\useMacroDashboard.ts
Line 15
await fetch(

hooks\useMacroDashboard.ts
Line 16
"/api/macro-dashboard"

lib\corporate\bse.ts
Line 3
const response = await fetch(

lib\live\liveBootstrap.ts
Line 12
"/api/live/stream"

lib\scheduler\eodScheduler.ts
Line 33
await fetch("http://localhost:3000/api/eod-refresh");

lib\sendWhatsApp.ts
Line 8
await fetch(

services\marketService.ts
Line 18
const response = await fetch(

services\marketService.ts
Line 19
`/api/kite?symbol=${encodeURIComponent(cleanSymbol)}`
