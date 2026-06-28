# BUILD_009A_STEP1.ps1
$ErrorActionPreference = "Stop"

Write-Host "== BUILD 009A - Step 1 ==" -ForegroundColor Cyan

$base = Join-Path (Get-Location) "lib\pattern"

if (!(Test-Path $base)) {
    throw "Run this script from the inst-dashboard project root."
}

$drawing = Join-Path $base "PatternDrawing.ts"

if (!(Test-Path $drawing)) {
@'
export interface DrawingPoint {
  index: number;
  price: number;
}

export interface DrawingLine {
  from: DrawingPoint;
  to: DrawingPoint;
  label?: string;
}

export interface PatternDrawing {
  lines: DrawingLine[];
  targets: number[];
  stopLoss?: number;
}
'@ | Set-Content $drawing -Encoding UTF8

Write-Host "Created PatternDrawing.ts" -ForegroundColor Green
}
else {
Write-Host "PatternDrawing.ts already exists." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "NEXT:"
Write-Host "Add drawing?: PatternDrawing to PatternResult."
