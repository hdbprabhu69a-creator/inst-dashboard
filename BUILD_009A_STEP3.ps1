# BUILD_009A_STEP3.ps1
$ErrorActionPreference="Stop"

Write-Host "====================================="
Write-Host "BUILD 009A - STEP 3"
Write-Host "Pattern Engine Drawing Scaffold"
Write-Host "====================================="

$root=Get-Location
$engine=Join-Path $root "lib\pattern\patternEngine.ts"

if(!(Test-Path $engine)){
    throw "Run from inst-dashboard root."
}

Copy-Item $engine "$engine.bak" -Force
Write-Host "Backup created."

$content=Get-Content $engine -Raw

if($content -notmatch 'PatternDrawing'){
    $content=$content -replace 'import\s*\{\s*PatternResult,\s*\}','import { PatternResult, } from "./types";' 
    $content='import { PatternDrawing } from "./PatternDrawing";'+"`r`n"+$content
}

if($content -notmatch 'createEmptyDrawing'){
$helper=@"

function createEmptyDrawing(): PatternDrawing {
  return {
    lines: [],
    targets: [],
    stopLoss: undefined
  };
}

"@
    $content=$helper+"`r`n"+$content
}

$content=$content -replace 'return candidates\[0\];','const best = candidates[0];'+"`r`n"+'best.drawing = createEmptyDrawing();'+"`r`n"+'return best;'

Set-Content $engine $content -Encoding UTF8

Write-Host ""
Write-Host "BUILD 009A STEP3 COMPLETE" -ForegroundColor Green
Write-Host "PatternResult now includes an empty drawing scaffold."
Write-Host "Next build will populate real lines and targets."
