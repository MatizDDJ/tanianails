# Script de configuración rápida para Tania Nails
# Ejecuta este script después de configurar Firebase

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TANIA NAILS - VERIFICACIÓN RÁPIDA   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar .env.local
Write-Host "1. Verificando archivo .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✓ Archivo .env.local existe" -ForegroundColor Green
    
    # Leer contenido
    $envContent = Get-Content ".env.local" -Raw
    
    # Verificar si tiene valores de ejemplo
    if ($envContent -match "tu-api-key-aqui" -or $envContent -match "tu-proyecto") {
        Write-Host "   ✗ ADVERTENCIA: .env.local contiene valores de ejemplo" -ForegroundColor Red
        Write-Host "     Debes reemplazarlos con tus credenciales reales de Firebase" -ForegroundColor Red
        Write-Host ""
    } else {
        Write-Host "   ✓ Variables de entorno configuradas" -ForegroundColor Green
    }
} else {
    Write-Host "   ✗ ERROR: Archivo .env.local no encontrado" -ForegroundColor Red
    Write-Host "     Crea el archivo .env.local con las credenciales de Firebase" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar WhatsApp en archivos
Write-Host "2. Verificando configuración de WhatsApp..." -ForegroundColor Yellow
$whatsappFiles = @(
    "components\booking-modal.tsx",
    "components\whatsapp-button.tsx",
    "components\contact.tsx",
    "components\footer.tsx",
    "components\hero.tsx"
)

$hasPlaceholder = $false
foreach ($file in $whatsappFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "598XXXXXXXX") {
            Write-Host "   ✗ $file contiene número placeholder" -ForegroundColor Red
            $hasPlaceholder = $true
        }
    }
}

if ($hasPlaceholder) {
    Write-Host ""
    Write-Host "   ACCIÓN NECESARIA:" -ForegroundColor Yellow
    Write-Host "   Reemplaza '598XXXXXXXX' con tu número real de WhatsApp" -ForegroundColor Yellow
    Write-Host "   Formato: código país + número (ej: 59899123456)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "   ✓ Número de WhatsApp configurado" -ForegroundColor Green
}

Write-Host ""

# Verificar node_modules
Write-Host "3. Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "   ✗ Dependencias no instaladas" -ForegroundColor Red
    Write-Host "     Ejecuta: pnpm install" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si quiere ejecutar el proyecto
$runDev = Read-Host "¿Quieres ejecutar el proyecto ahora? (s/n)"
if ($runDev -eq "s" -or $runDev -eq "S") {
    Write-Host ""
    Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
    Write-Host "El proyecto estará disponible en http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    pnpm dev
}
