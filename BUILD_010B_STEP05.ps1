###############################################
# BUILD 010B
# STEP 05
# VERIFY useLiveChart & COMMIT
###############################################

$root = Get-Location

$file = "$root\hooks\useLiveChart.ts"

if (!(Test-Path $file)) {
    Write-Host "ERROR: hooks\useLiveChart.ts not found."
    exit 1
}

Write-Host ""
Write-Host "===================================="
Write-Host "BUILD 010B STEP 05"
Write-Host "===================================="
Write-Host ""

$content = Get-Content $file -Raw

if ($content -match "SBIN:\s*779521") {
    Write-Host "INFO: Static SBIN mapping detected."
    Write-Host "Next build will replace this with dynamic token lookup."
} else {
    Write-Host "INFO: Static mapping already removed."
}

Write-Host ""
Write-Host "Creating git commit..."

git add .

git commit -m "BUILD 010B STEP 05 - Verify useLiveChart and prepare token resolver"

if ($LASTEXITCODE -eq 0) {
    git push origin main
    git status
    Write-Host ""
    Write-Host "BUILD 010B STEP 05 COMPLETE"
} else {
    Write-Host ""
    Write-Host "No changes to commit or commit failed."
    git status
}
