# BUILD_009X_VERIFY_2.ps1
$ErrorActionPreference="Stop"
$Root=(Get-Location).Path
$Report=Join-Path $Root "INTEGRATION_REPORT.md"

"# Integration Report" | Set-Content $Report
"" | Add-Content $Report

$tsx=Get-ChildItem $Root -Recurse -Include *.ts,*.tsx

$imports=@{}
foreach($f in $tsx){
    $text=Get-Content $f.FullName -Raw
    $matches=[regex]::Matches($text,'import\s+.*?from\s+["'']([^"'']+)["'']')
    $imports[$f.FullName]=$matches
}

"## Pages" | Add-Content $Report
$pages=Get-ChildItem "$Root\app" -Recurse -Filter page.tsx -ErrorAction SilentlyContinue
foreach($p in $pages){
    Add-Content $Report ""
    Add-Content $Report ("### "+$p.FullName.Replace($Root+"\",""))
    $text=Get-Content $p.FullName -Raw

    $local=[regex]::Matches($text,'import\s+([A-Za-z0-9_]+).*?from\s+["''](@/components/[^"'']+|@/app/components/[^"'']+|@/lib/chart/[^"'']+)["'']')
    if($local.Count -eq 0){
        Add-Content $Report "- No matching local component imports detected."
    } else {
        foreach($m in $local){
            Add-Content $Report ("- "+$m.Groups[1].Value+" <= "+$m.Groups[2].Value)
        }
    }
}

"`n## Component Usage`" | Add-Content $Report
$components=Get-ChildItem "$Root\components" -Recurse -Filter *.tsx -ErrorAction SilentlyContinue
foreach($c in $components){
    $name=[IO.Path]::GetFileNameWithoutExtension($c.Name)
    $count=0
    foreach($f in $tsx){
        if($f.FullName -eq $c.FullName){continue}
        $raw=Get-Content $f.FullName -Raw
        if($raw -match ("\b"+[regex]::Escape($name)+"\b")){
            $count++
        }
    }
    Add-Content $Report ("- {0} : {1} reference(s)" -f $name,$count)
}

"`n## Chart Modules`" | Add-Content $Report
Get-ChildItem "$Root\lib\chart" -Recurse -Filter *.tsx -ErrorAction SilentlyContinue | ForEach-Object{
    Add-Content $Report ("- "+$_.FullName.Replace($Root+"\",""))
}

"`nCompleted. Report: $Report" | Write-Host -ForegroundColor Green
