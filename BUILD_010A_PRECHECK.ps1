$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " BUILD 010A - PRECHECK" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$Target = ".\lib\chart\CandlestickChart.tsx"

if (!(Test-Path $Target)) {
    Write-Host "ERROR: CandlestickChart.tsx not found." -ForegroundColor Red
    exit 1
}

$Backup = ".\lib\chart\CandlestickChart.tsx.bak_010A"
Copy-Item $Target $Backup -Force
Write-Host "[OK] Backup created: $Backup" -ForegroundColor Green

$Report = "BUILD_010A_REPORT.txt"
if (Test-Path $Report) { Remove-Item $Report }

"==============================" | Out-File $Report
" BUILD 010A PRECHECK REPORT" | Out-File $Report -Append
"==============================" | Out-File $Report -Append
"" | Out-File $Report -Append

function Add-Section($Title, $Pattern) {
    "===== $Title =====" | Out-File $Report -Append
    Select-String -Path $Target -Pattern $Pattern |
        ForEach-Object {
            "$($_.LineNumber): $($_.Line.Trim())"
        } | Out-File $Report -Append
    "" | Out-File $Report -Append
}

Add-Section "subscribeCrosshairMove" "subscribeCrosshairMove"
Add-Section "setOhlc" "setOhlc"
Add-Section "useCrosshair" "useCrosshair"
Add-Section "setCrosshair" "setCrosshair"
Add-Section "Corrupted UTF8" "â|ðŸ|ï¼|â‚¹"

Write-Host ""
Write-Host "[OK] Report generated: BUILD_010A_REPORT.txt" -ForegroundColor Green
Write-Host "Completed." -ForegroundColor Cyan
