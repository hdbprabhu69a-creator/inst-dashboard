$ErrorActionPreference="Stop"

$File=".\lib\chart\CandlestickChart.tsx"

if(!(Test-Path $File)){
    Write-Host "File not found" -ForegroundColor Red
    exit
}

# Backup
Copy-Item $File "$File.bak_010A" -Force

Write-Host "Backup created" -ForegroundColor Green

$lines = Get-Content $File

for($i=0;$i -lt $lines.Length;$i++){

    if($lines[$i] -match "setOhlc\(\{"){

        $start=$i
        $end=$i

        for($j=$i;$j -lt $lines.Length;$j++){
            if($lines[$j] -match "\}\);"){
                $end=$j
                break
            }
        }

        $block=$lines[$start..$end]

        $newBlock=@()

        foreach($line in $block){

            $newBlock+=$line

            if($line -match "close:"){

                $newBlock+="      setCrosshair({"
                $newBlock+="        time: String(param.time),"
                $newBlock+="        open: (price as any).open,"
                $newBlock+="        high: (price as any).high,"
                $newBlock+="        low: (price as any).low,"
                $newBlock+="        close: (price as any).close,"
                $newBlock+="        volume: (price as any).volume ?? 0"
                $newBlock+="      });"
            }
        }

        $before=$lines[0..($start-1)]
        $after=$lines[($end+1)..($lines.Length-1)]

        $lines=$before + $newBlock + $after
        break
    }
}

Set-Content $File $lines -Encoding UTF8

Write-Host "BUILD 010A COMPLETE - Crosshair synced" -ForegroundColor Green
