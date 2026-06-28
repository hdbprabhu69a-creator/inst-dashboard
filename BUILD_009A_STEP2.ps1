# BUILD_009A_STEP2.ps1
$ErrorActionPreference = "Stop"

Write-Host "====================================="
Write-Host "BUILD 009A - STEP 2"
Write-Host "====================================="

$types = Join-Path (Get-Location) "lib\pattern\types.ts"
if (!(Test-Path $types)) { throw "Run from inst-dashboard root." }

Copy-Item $types "$types.bak" -Force

$content = Get-Content $types -Raw

if ($content -notmatch 'import\s+\{\s*PatternDrawing\s*\}') {
    $content = 'import { PatternDrawing } from "./PatternDrawing";' + "`r`n`r`n" + $content
}

if ($content -notmatch 'drawing\?\s*:\s*PatternDrawing') {
    $content = $content -replace 'points:\s*PatternPoint\[\];', 'points: PatternPoint[];`r`n`r`n  drawing?: PatternDrawing;'
}

Set-Content $types $content -Encoding UTF8

Write-Host "BUILD 009A STEP2 COMPLETE" -ForegroundColor Green
