Import-Csv "data\zerodha-instruments.csv" |
Where-Object{
    $_.exchange -eq "NSE" -and (
        $_.tradingsymbol -match "PRIVATE" -or
        $_.tradingsymbol -match "CONSUMER" -or
        $_.tradingsymbol -match "BANK" -or
        $_.tradingsymbol -match "DURABLE"
    )
} |
Sort-Object tradingsymbol |
Select-Object tradingsymbol,instrument_token,name |
Format-Table -AutoSize
