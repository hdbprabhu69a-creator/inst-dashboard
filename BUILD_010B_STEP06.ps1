###############################################
# BUILD 010B
# STEP 06
# VERIFY TOKEN RESOLVER READINESS
###############################################

$root = Get-Location

$file = "$root\hooks\useLiveChart.ts"

if (!(Test-Path $file)) {
    Write-Host "ERROR: hooks\useLiveChart.ts not found."
    exit 1
}

Copy-Item $file "$file.bak010B06" -Force

$content = Get-Content $file -Raw

Write-Host ""
Write-Host "===================================="
Write-Host "BUILD 010B STEP 06"
Write-Host "===================================="
Write-Host ""

if ($content -match "const instrumentMap") {
    Write-Host "[OK] Static instrument map located."
    Write-Host "[NEXT] Replace with Firestore token resolver in STEP 07."
} else {
    Write-Host "[OK] Static map already replaced."
}

if ($content -match "getMarketData") {
    Write-Host "[OK] getMarketData integration present."
}

if ($content -match "analyzePattern") {
    Write-Host "[OK] Pattern engine integration present."
}

git add .

git diff --cached --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "No source changes detected."
    git status
    exit 0
}

git commit -m "BUILD 010B STEP 06 - Verify token resolver readiness"

if ($LASTEXITCODE -eq 0) {
    git push origin main
    git status
}

Write-Host ""
Write-Host "BUILD 010B STEP 06 COMPLETE"
