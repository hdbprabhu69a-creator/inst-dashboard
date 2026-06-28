Write-Host "===================================="
Write-Host " INSTITUTIONAL ENGINE STARTING"
Write-Host "===================================="

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "[1/3] Clearing Universe..."
npx tsx scripts/clearUniverse.ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ clearUniverse failed"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "[2/3] Uploading Universe..."
npx tsx scripts/uploadUniverse.ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ uploadUniverse failed"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "[3/3] Importing History..."
npx tsx scripts/import-history.ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ import-history failed"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "===================================="
Write-Host " ENGINE RUN COMPLETE"
Write-Host "===================================="