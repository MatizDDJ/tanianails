# Script de Configuración Rápida - Tania Nails
# Este script te ayuda a configurar rápidamente el número de WhatsApp

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TANIA NAILS - Configuración Rápida" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar número de WhatsApp
Write-Host "📱 Ingresa tu número de WhatsApp" -ForegroundColor Yellow
Write-Host "   Formato: Código país + número (sin espacios ni símbolos)" -ForegroundColor Gray
Write-Host "   Ejemplo Uruguay: 59899123456" -ForegroundColor Gray
Write-Host ""
$whatsapp = Read-Host "Número de WhatsApp"

if ([string]::IsNullOrWhiteSpace($whatsapp)) {
    Write-Host "❌ Error: Debes ingresar un número" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔄 Actualizando archivos..." -ForegroundColor Yellow

# Archivos a actualizar
$archivos = @(
    "components\hero.tsx",
    "components\whatsapp-button.tsx",
    "components\contact.tsx",
    "components\footer.tsx",
    "components\booking-modal.tsx"
)

$reemplazados = 0
$errores = 0

foreach ($archivo in $archivos) {
    $rutaCompleta = Join-Path $PSScriptRoot $archivo
    
    if (Test-Path $rutaCompleta) {
        try {
            $contenido = Get-Content $rutaCompleta -Raw -Encoding UTF8
            $contenidoNuevo = $contenido -replace '598XXXXXXXX', $whatsapp
            
            if ($contenido -ne $contenidoNuevo) {
                Set-Content $rutaCompleta -Value $contenidoNuevo -Encoding UTF8 -NoNewline
                Write-Host "   ✅ Actualizado: $archivo" -ForegroundColor Green
                $reemplazados++
            } else {
                Write-Host "   ⚠️  Sin cambios: $archivo" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "   ❌ Error en: $archivo" -ForegroundColor Red
            $errores++
        }
    } else {
        Write-Host "   ⚠️  No encontrado: $archivo" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Archivos actualizados: $reemplazados" -ForegroundColor Green
if ($errores -gt 0) {
    Write-Host "Errores encontrados: $errores" -ForegroundColor Red
}
Write-Host ""
Write-Host "Tu número configurado: $whatsapp" -ForegroundColor Cyan
Write-Host ""

# Verificar si el servidor está corriendo
$proceso = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next dev*" }

if ($proceso) {
    Write-Host "⚠️  IMPORTANTE: Reinicia el servidor de desarrollo" -ForegroundColor Yellow
    Write-Host "   Presiona Ctrl+C en la terminal donde corre 'pnpm dev'" -ForegroundColor Gray
    Write-Host "   Luego ejecuta: pnpm dev" -ForegroundColor Gray
} else {
    Write-Host "💡 Ahora puedes ejecutar: pnpm dev" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ ¡Configuración completada!" -ForegroundColor Green
Write-Host ""

# Preguntar si quiere configurar Instagram
Write-Host "¿Quieres configurar tu Instagram también? (S/N): " -ForegroundColor Yellow -NoNewline
$respuesta = Read-Host

if ($respuesta -eq "S" -or $respuesta -eq "s") {
    Write-Host ""
    Write-Host "📸 Ingresa tu usuario de Instagram (sin @)" -ForegroundColor Yellow
    Write-Host "   Ejemplo: tanianails_uy" -ForegroundColor Gray
    Write-Host ""
    $instagram = Read-Host "Usuario de Instagram"
    
    if (![string]::IsNullOrWhiteSpace($instagram)) {
        $archivoGallery = "components\gallery.tsx"
        $rutaGallery = Join-Path $PSScriptRoot $archivoGallery
        
        if (Test-Path $rutaGallery) {
            try {
                $contenido = Get-Content $rutaGallery -Raw -Encoding UTF8
                $contenidoNuevo = $contenido -replace 'instagram\.com/tanianails', "instagram.com/$instagram"
                Set-Content $rutaGallery -Value $contenidoNuevo -Encoding UTF8 -NoNewline
                Write-Host "   ✅ Instagram configurado: @$instagram" -ForegroundColor Green
            } catch {
                Write-Host "   ❌ Error al configurar Instagram" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Reinicia el servidor (pnpm dev)" -ForegroundColor White
Write-Host "2. Prueba el botón de WhatsApp en http://localhost:3000" -ForegroundColor White
Write-Host "3. Sube fotos reales a la carpeta /public" -ForegroundColor White
Write-Host "4. Lee MEJORAS_IMPLEMENTADAS.md para ver todo lo nuevo" -ForegroundColor White
Write-Host ""
Write-Host "🎉 ¡Todo listo! Tu página está casi lista para producción" -ForegroundColor Green
Write-Host ""

pause
