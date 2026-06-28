# BUILD_009X_VERIFY.ps1
# Institutional Dashboard Verification Script (Starter)

$ErrorActionPreference = "Stop"

$Root = Get-Location
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " BUILD_009X VERIFY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Project : $Root"
Write-Host ""

$Report = Join-Path $Root "PROJECT_REPORT.md"

"# PROJECT REPORT" | Set-Content $Report
"" | Add-Content $Report

function Add-Section($Title) {
    Add-Content $Report "## $Title"
}

function Scan($Path,$Filter) {
    if(Test-Path $Path){
        $items = Get-ChildItem $Path -Recurse -File -Filter $Filter
        foreach($i in $items){
            $rel = $i.FullName.Replace($Root.Path + "\", "")
            Write-Host $rel
            Add-Content $Report "- $rel"
        }
        return $items.Count
    }
    return 0
}

Add-Section "Pages"
$pages = Scan "app" "*.tsx"

Add-Section "Components"
$components = Scan "components" "*.tsx"

Add-Section "Libraries"
$libs = Scan "lib" "*.*"

Add-Section "API Routes"
$apis = 0
if(Test-Path "app\api"){
    $apis = (Get-ChildItem "app\api" -Recurse -File).Count
    Get-ChildItem "app\api" -Recurse -File | ForEach-Object{
        Add-Content $Report ("- " + $_.FullName.Replace($Root.Path + "\", ""))
    }
}

"" | Add-Content $Report
Add-Content $Report "## Summary"
Add-Content $Report "- Pages      : $pages"
Add-Content $Report "- Components : $components"
Add-Content $Report "- LibraryFiles : $libs"
Add-Content $Report "- API Files  : $apis"

Write-Host ""
Write-Host "Verification complete." -ForegroundColor Green
Write-Host "Report generated:"
Write-Host $Report -ForegroundColor Yellow
