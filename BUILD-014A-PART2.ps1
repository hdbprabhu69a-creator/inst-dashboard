####################################################
# BUILD-014A PART-2
# Top Gainers / Top Losers
####################################################

# ---------- API ----------

$api="app\api\watchlist\route.ts"

$c=Get-Content $api -Raw

$c=$c.Replace(
'const liveVolume =
  q?.volume ??
  stock.totalVolumeDaily ??
  0;',
'const liveVolume =
  q?.volume ??
  stock.totalVolumeDaily ??
  0;

const prevClose =
  q?.ohlc?.close ??
  stock.dailyOHLC?.close ??
  0;

const change =
  liveCmp - prevClose;

const changePct =
  prevClose > 0
    ? (change / prevClose) * 100
    : 0;'
)

$c=$c.Replace(
'cmp: liveCmp,',
'cmp: liveCmp,

change,
changePct,'
)

Set-Content $api $c -Encoding UTF8

####################################################
# WATCHLIST PAGE
####################################################

$page="app\watchlist\page.tsx"

$c=Get-Content $page -Raw

$c=$c.Replace(
'cmp:number;',
'cmp:number;

change:number;
changePct:number;'
)

$c=$c.Replace(
'<option>Momentum</option>',
'<option>Momentum</option>
<option>Top Gainers</option>
<option>Top Losers</option>'
)

$c=$c.Replace(
'case "Momentum":
        typeMatch =
          r.score >= 80;
        break;',
'case "Momentum":
        typeMatch =
          r.score >= 80;
        break;

      case "Top Gainers":
      case "Top Losers":
        typeMatch = true;
        break;'
)

$c=$c.Replace(
'const filtered =
  rows.filter((r) => {',
'let filtered =
  rows.filter((r) => {'
)

$c=$c.Replace(
'  });',
'  });

if(scannerApplied){

if(scannerType==="Top Gainers"){

filtered=filtered.sort(
(a,b)=>b.changePct-a.changePct
);

}

if(scannerType==="Top Losers"){

filtered=filtered.sort(
(a,b)=>a.changePct-b.changePct
);

}

}'
)

$c=$c.Replace(
'<th className="w-[40px] text-cyan-400">SC</th>',
'<th className="w-[42px] text-cyan-400">CHG%</th>

<th className="w-[40px] text-cyan-400">SC</th>'
)

$c=$c.Replace(
'<td
 className={`text-center font-bold ${scoreColor(r.score)}`}
>
 {r.score}
</td>',
'<td className={`text-center font-bold ${r.changePct>=0?"text-green-400":"text-red-400"}`}>
{r.changePct.toFixed(2)}%
</td>

<td
 className={`text-center font-bold ${scoreColor(r.score)}`}
>
 {r.score}
</td>'
)

Set-Content $page $c -Encoding UTF8

Write-Host ""
Write-Host "===================================="
Write-Host " BUILD-014A PART-2 COMPLETED"
Write-Host "===================================="
Write-Host "? Top Gainers"
Write-Host "? Top Losers"
Write-Host "? Change % Column"
Write-Host "? Live Sorting"
Write-Host "===================================="

