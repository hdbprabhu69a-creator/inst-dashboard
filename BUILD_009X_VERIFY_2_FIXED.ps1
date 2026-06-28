# BUILD_009X_VERIFY_2_FIXED.ps1
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Report = Join-Path $Root "INTEGRATION_REPORT.md"

"# Integration Report" | Set-Content $Report
"" | Add-Content $Report

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " BUILD_009X VERIFY 2 (FIXED)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$AllFiles = Get-ChildItem -Path $Root -Recurse -File -Include *.ts,*.tsx

"## Pages" | Add-Content $Report
$Pages = Get-ChildItem -Path (Join-Path $Root "app") -Recurse -Filter "page.tsx" -ErrorAction SilentlyContinue

foreach($Page in $Pages){
    $Rel = $Page.FullName.Substring($Root.Length + 1)
    Add-Content $Report ""
    Add-Content $Report "### $Rel"

    $Text = Get-Content $Page.FullName -Raw

    $Matches = [regex]::Matches($Text,'@/components/[A-Za-z0-9_/\-]+')

    if($Matches.Count -eq 0){
        Add-Content $Report "- No @/components imports detected."
    } else {
        foreach($M in $Matches){
            Add-Content $Report ("- " + $M.Value)
        }
    }
}

"" | Add-Content $Report
"## Component Usage" | Add-Content $Report

$Components = Get-ChildItem -Path (Join-Path $Root "components") -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue

foreach($Comp in $Components){
    $Name = [System.IO.Path]::GetFileNameWithoutExtension($Comp.Name)
    $Count = 0

    foreach($File in $AllFiles){
        if($File.FullName -eq $Comp.FullName){ continue }
        $Content = Get-Content $File.FullName -Raw
        if($Content -match ("\b" + [regex]::Escape($Name) + "\b")){
            $Count++
        }
    }

    Add-Content $Report ("- {0} : {1} reference(s)" -f $Name,$Count)
}

"" | Add-Content $Report
"## Chart Files" | Add-Content $Report

$ChartPath = Join-Path $Root "lib\chart"
if(Test-Path $ChartPath){
    Get-ChildItem -Path $ChartPath -Recurse -File | ForEach-Object{
        $Rel = $_.FullName.Substring($Root.Length + 1)
        Add-Content $Report ("- " + $Rel)
    }
}

Write-Host ""
Write-Host "Integration report generated:" -ForegroundColor Green
Write-Host $Report -ForegroundColor Yellow
