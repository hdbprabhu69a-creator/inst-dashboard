$ErrorActionPreference="Stop"

$File=".\lib\chart\CandlestickChart.tsx"
if(!(Test-Path $File)){Write-Host "File not found" -ForegroundColor Red; exit}

Copy-Item $File "$File.bak_010A_FIX" -Force

$lines=Get-Content $File
$out=@()
$inserted=$false

for($i=0;$i -lt $lines.Count;$i++){
    $out += $lines[$i]

    if(-not $inserted -and $lines[$i].Trim() -eq "});"){
        # look back a few lines to ensure this is the setOhlc block
        $start=[Math]::Max(0,$i-20)
        $context=($lines[$start..$i] -join "`n")
        if($context -match "setOhlc\(\{"){
            $out += "        setCrosshair({"
            $out += "          time: String(param.time),"
            $out += "          open: (price as any).open,"
            $out += "          high: (price as any).high,"
            $out += "          low: (price as any).low,"
            $out += "          close: (price as any).close,"
            $out += "          volume: (price as any).volume ?? 0,"
            $out += "        });"
            $inserted=$true
        }
    }
}

if(-not $inserted){
    Write-Host "Failed: setOhlc block not found." -ForegroundColor Red
    exit 1
}

Set-Content $File $out -Encoding UTF8
Write-Host "BUILD_010A_FIX COMPLETE" -ForegroundColor Green
