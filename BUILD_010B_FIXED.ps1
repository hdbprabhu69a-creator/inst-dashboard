$ErrorActionPreference="Stop"

$File=".\lib\chart\CandlestickChart.tsx"

if(!(Test-Path $File)){
    Write-Host "File not found" -ForegroundColor Red
    exit 1
}

Copy-Item $File "$File.bak_010B" -Force

$text = Get-Content $File -Raw

# Fix currency
$text = $text -replace "â‚¹","₹"

# Safe replacements
$text = $text -replace "âœ›","⌖"
$text = $text -replace "â•±","╱"
$text = $text -replace "â”","─"
$text = $text -replace "â¬Œ","➜"
$text = $text -replace "â–­","▭"
$text = $text -replace "â—¯","◯"
$text = $text -replace "âŒ–","⌖"
$text = $text -replace "ðŸ–‰","✎"
$text = $text -replace "ðŸ“","📏"
$text = $text -replace "ï¼‹","+"
$text = $text -replace "ï¼","−"

Set-Content $File $text -Encoding UTF8

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "BUILD 010B FIXED COMPLETE" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Currency + toolbar encoding fixed"
