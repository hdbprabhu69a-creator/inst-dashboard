$ErrorActionPreference="Stop"

$File=".\lib\chart\CandlestickChart.tsx"

if(!(Test-Path $File)){
    Write-Host "CandlestickChart.tsx not found." -ForegroundColor Red
    exit 1
}

Copy-Item $File "$File.bak_010C" -Force

$text = Get-Content $File -Raw

# Currency: avoid Unicode parser issues
$text = $text -replace 'â‚¹','Rs.'

# Replace corrupted toolbar strings with ASCII labels
$replacements = @(
    @('âœ›','CH'),
    @('â•±','TL'),
    @('â”','HL'),
    @('â¬Œ','RAY'),
    @('â–­','BOX'),
    @('â—¯','CIR'),
    @('âŒ–','FIB'),
    @('ðŸ–‰','BR'),
    @('ðŸ“','MSR'),
    @('ï¼‹','+'),
    @('ï¼','-'),
    @('â€¢','*')
)

foreach($r in $replacements){
    $text = $text.Replace($r[0],$r[1])
}

Set-Content $File $text -Encoding UTF8

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host " BUILD_010C COMPLETE" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Backup created: $File.bak_010C"
Write-Host "ASCII toolbar cleanup applied."
