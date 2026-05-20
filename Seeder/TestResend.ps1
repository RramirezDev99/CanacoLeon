# Prueba el envio de correo via Resend (API HTTP).
# Uso:
#   .\Seeder\TestResend.ps1 -Email "admin@canaco.com" -Password "tu_pass"

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
Write-Host "===== Test Resend =====" -ForegroundColor Cyan
try {
    $resp = Invoke-WebRequest -Uri "$ApiUrl/contacto/test-resend" -Method Get -Headers @{Authorization="Bearer $token"} -UseBasicParsing -TimeoutSec 60
    Write-Host "HTTP $($resp.StatusCode)" -ForegroundColor Green
    Write-Host $resp.Content
} catch {
    Write-Host "FALLO:" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $stream.Position = 0
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host "  Body: $($reader.ReadToEnd())"
        } catch {}
    }
    if ($_.ErrorDetails) { Write-Host "  Detalles: $($_.ErrorDetails.Message)" }
}
