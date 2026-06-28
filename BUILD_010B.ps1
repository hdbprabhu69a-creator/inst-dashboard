$ErrorActionPreference="Stop"

$File=".\lib\chart\CandlestickChart.tsx"

if(!(Test-Path $File)){
    Write-Host "CandlestickChart.tsx not found." -ForegroundColor Red
    exit 1
}

Copy-Item $File "$File.bak_010B" -Force

$text = Get-Content $File -Raw

# Currency
$text = $text -replace 'â‚¹','₹'

# Toolbar/icon mojibake replacements
$map = @{
    'âœ›'='⌖'
    'â•±'='╱'
    'â”'='─'
    'â¬Œ'='➜'
    'â–­'='▭'
    'â—¯'='◯'
    'âŒ–'='⌖'
    'ðŸ–‰'='✎'
    'ðŸ“'='📏'
    'ï¼‹'='+'
    'ï¼'='−'
    'â€¢'='•'
}

foreach($k in $map.Keys){
    $text = $text.Replace($k,$map[$k])
}

Set-Content $File $text -Encoding UTF8

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host " BUILD_010B COMPLETE" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Backup : $File.bak_010B"
Write-Host "UTF-8 toolbar cleanup applied."
Write-Host "Currency symbol cleanup applied."
