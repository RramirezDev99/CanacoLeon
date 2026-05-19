# Script de diagnóstico para el endpoint test-smtp.
# Imprime CADA paso con detalle para no quedarnos a ciegas.
#
# Uso:
#   .\Seeder\TestSmtp.ps1 -Email "admin@canaco.com" -Password "tu_pass"

param(
    [Parameter(Mandatory=$true)] [string] $Email,
    [Parameter(Mandatory=$true)] [string] $Password,
    [string] $ApiUrl = "https://canacoleon-production.up.railway.app/api"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " TEST SMTP — Diagnóstico" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Email: $Email"
Write-Host "URL:   $ApiUrl"
Write-Host ""

# --- 1) LOGIN ---
Write-Host "[1/2] Haciendo login..." -ForegroundColor Yellow
$loginJson = @{ email = $Email; password = $Password } | ConvertTo-Json
$token = $null
try {
    $loginResp = Invoke-RestMethod -Uri "$ApiUrl/auth/login" -Method Post `
        -ContentType "application/json" -Body $loginJson
    $token = $loginResp.token
    if ($token) {
        Write-Host "  Login OK. Token: $($token.Substring(0,20))..." -ForegroundColor Green
    } else {
        Write-Host "  El login no devolvió token. Respuesta: $($loginResp | ConvertTo-Json)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  Login FALLÓ:" -ForegroundColor Red
    Write-Host "    Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "    Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host "    Body: $($reader.ReadToEnd())" -ForegroundColor Red
        } catch {}
    }
    exit 1
}

Write-Host ""
Write-Host "[2/2] Llamando a /contacto/test-smtp ..." -ForegroundColor Yellow
Write-Host "  (puede tardar hasta ~30s si SMTP está bloqueado)" -ForegroundColor DarkGray

try {
    $resp = Invoke-WebRequest -Uri "$ApiUrl/contacto/test-smtp" `
        -Method Get -Headers @{Authorization="Bearer $token"} `
        -UseBasicParsing -TimeoutSec 120
    Write-Host "  HTTP $($resp.StatusCode):" -ForegroundColor Green
    Write-Host $resp.Content
} catch {
    Write-Host "  Llamada FALLÓ:" -ForegroundColor Red
    Write-Host "    Mensaje: $($_.Exception.Message)" -ForegroundColor Red

    # Si fue un HTTP error, intentamos leer el body de la respuesta
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "    HTTP status: $statusCode" -ForegroundColor Red
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $stream.Position = 0
            $reader = New-Object System.IO.StreamReader($stream)
            $body = $reader.ReadToEnd()
            Write-Host "    Body de la respuesta:" -ForegroundColor Red
            Write-Host $body
        } catch {
            Write-Host "    (no se pudo leer el body de la respuesta)" -ForegroundColor DarkRed
        }
    }
    if ($_.ErrorDetails) {
        Write-Host "    ErrorDetails: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fin." -ForegroundColor Cyan
