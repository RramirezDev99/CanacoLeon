# Llama a /api/contacto/diag-network y muestra una tabla bonita
# con DNS + TCP a varios SMTP y un control HTTPS.

param(
    [Parameter(Mandatory=$true)] [string] $Email,
    [Parameter(Mandatory=$true)] [string] $Password,
    [string] $ApiUrl = "https://canacoleon-production.up.railway.app/api"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===== Login =====" -ForegroundColor Cyan
$loginJson = @{ email = $Email; password = $Password } | ConvertTo-Json
try {
    $token = (Invoke-RestMethod -Uri "$ApiUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginJson).token
} catch {
    Write-Host "Login fallo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host "Login OK" -ForegroundColor Green

Write-Host ""
Write-Host "===== Diagnostico de red desde Railway =====" -ForegroundColor Cyan
try {
    $resp = Invoke-RestMethod -Uri "$ApiUrl/contacto/diag-network" -Headers @{Authorization="Bearer $token"} -TimeoutSec 120
} catch {
    Write-Host "Fallo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
    exit 1
}

Write-Host $resp.mensaje
Write-Host ""

$resp.resultados | Format-Table @{Label="Host";Expression={$_.host}},
                                @{Label="Port";Expression={$_.port}},
                                @{Label="Descripcion";Expression={$_.desc}},
                                @{Label="DNS";Expression={$_.dnsStatus}},
                                @{Label="DNS ms";Expression={$_.dnsMs}},
                                @{Label="TCP";Expression={$_.tcpStatus}},
                                @{Label="TCP ms";Expression={$_.tcpMs}} -AutoSize -Wrap
