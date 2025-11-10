# 🎯 GUÍA RÁPIDA DE USO - TANIA NAILS

## ✅ ESTADO ACTUAL

Tu servidor está corriendo en:
- **Local:** http://localhost:3000
- **Red:** http://169.254.83.107:3000 (para probar en celular)

---

## 🚀 INICIO RÁPIDO (3 PASOS)

### 1️⃣ Configurar WhatsApp (2 minutos)

```powershell
# En PowerShell, ejecuta:
.\configurar-whatsapp.ps1
```

El script te preguntará:
- ✅ Tu número de WhatsApp (ej: 59899123456)
- ✅ Tu usuario de Instagram (opcional)

**¡Y listo!** Todos los archivos se actualizan automáticamente.

---

### 2️⃣ Configurar Cloudinary (5 minutos) - NUEVO ✨

**¿Para qué?** Subir fotos desde tu celular directamente a la galería

```
1. Ve a: https://cloudinary.com/users/register/free
2. Regístrate con tu email
3. Copia tus credenciales del Dashboard:
   - Cloud Name
   - API Key
   - API Secret
4. Crea archivo .env.local en la raíz del proyecto
5. Agrega:
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret

   daznffgsh
   986283345491915
   xLKBrRWoZ2ApwvsWP6d2lsk8qgQ

6. Reinicia servidor (Ctrl+C → pnpm dev)
```

**📚 Guía detallada:** Ver `CLOUDINARY_SETUP.md`

---

### 3️⃣ Crear Índice Firebase (2 minutos)

```
1. Ve a: https://console.firebase.google.com
2. Tu proyecto → Firestore Database → Indexes
3. Create Index:
   - Collection: galeria
   - Field: orden → Ascending
4. Espera 2-5 minutos
```

---

### 4️⃣ Cambiar Contraseña Admin (1 minuto)

1. Abre: `components/admin-auth.tsx`
2. Busca línea 18: `const ADMIN_PASSWORD = "TaniaNails2024"`
3. Cambia por tu contraseña
4. Guarda

---

### 5️⃣ Probar Todo (5 minutos)

#### A) Probar Admin:
1. Ve a: http://localhost:3000/admin
2. Ingresa contraseña
3. Crea un turno de prueba
4. ✅ Verifica que aparece en la lista

#### B) Probar Galería: ✨ NUEVO
1. Ve a: http://localhost:3000/admin
2. Pestaña "Galería"
3. Click "Subir desde Celular"
4. Selecciona una foto
5. Espera "Imagen lista ✓"
6. Completa descripción y categoría
7. Click "Agregar Imagen"
8. Ve a la home y verifica que aparece
9. ✅ Prueba filtros por categoría

#### C) Probar Reserva:
1. Ve a: http://localhost:3000
2. Scroll a "Servicios"
3. Clic en "Reservar" en cualquier servicio
4. Selecciona fecha y hora
5. Completa formulario (teléfono + nombre)
6. Selecciona método de pago (efectivo/transferencia)
7. ✅ Verifica que aparece en Admin → Reservas

#### D) Probar Móvil:
**Opción 1 - Tu celular:**
1. Conéctate a la misma WiFi
2. Abre: http://169.254.83.107:3000
3. ✅ Verifica que se ve bien

**Opción 2 - Simulador:**
1. Presiona F12 en Chrome
2. Clic en icono de celular (Toggle device toolbar)
3. Selecciona "iPhone 12 Pro"
4. ✅ Verifica responsive

---

## 🎨 CARACTERÍSTICAS IMPLEMENTADAS

### � Galería de Imágenes (NUEVO) ✨
- ✅ Subir fotos desde celular/cámara
- ✅ Optimización automática (resize + compresión)
- ✅ Conversión a WebP (96% menos peso)
- ✅ Dos métodos: archivo o URL
- ✅ Gestión de orden (flechas)
- ✅ Filtros por categoría (9 tipos)
- ✅ Link a Instagram
- ✅ Eliminación con confirmación

### 👥 Sistema de Clientes (NUEVO) ✨
- ✅ Historial automático
- ✅ Autocompletar datos (WhatsApp)
- ✅ Tracking de servicios frecuentes
- ✅ Búsqueda con debounce (500ms)

### 📊 Estadísticas (NUEVO) ✨
- ✅ Dashboard con 6 métricas
- ✅ Gráfico top 5 servicios
- ✅ Breakdown métodos de pago
- ✅ Servicio más popular
- ✅ Cálculos en tiempo real

### 💳 Método de Pago (NUEVO) ✨
- ✅ Selector efectivo/transferencia
- ✅ Guardado en reserva
- ✅ Visible en admin
- ✅ Estadísticas por método

### �🔒 Seguridad
- ✅ Login protegido en `/admin`
- ✅ Sesión persistente
- ✅ Contraseña personalizable
- ✅ UI profesional de login
- ✅ Easter egg (5 clicks en logo)

### 📱 Responsive Design
- ✅ Móvil (< 640px): Layout vertical
- ✅ Tablet (640-1024px): 2-3 columnas
- ✅ Desktop (> 1024px): 4 columnas
- ✅ Todos los componentes adaptados
- ✅ Menu hamburguesa animado

### ✨ Animaciones
- ✅ Fade in al cargar
- ✅ Scale en hover (botones)
- ✅ Glow effects
- ✅ Pulse en selección
- ✅ Loading spinners
- ✅ Smooth transitions
- ✅ Hamburger menu (3 líneas → X)

---

## 📋 CHECKLIST PRE-PRODUCCIÓN

### Configuración Básica:
- [ ] ✅ Firebase configurado (.env.local)
- [ ] ⏳ WhatsApp configurado (ejecuta script)
- [ ] ⏳ Contraseña admin cambiada
- [ ] ⏳ Instagram configurado

### Contenido:
- [ ] ⏳ Subir fotos reales a `/public`
- [ ] ⏳ Actualizar precios si es necesario
- [ ] ⏳ Verificar descripción de servicios
- [ ] ⏳ Agregar más servicios (opcional)

### Testing:
- [ ] ⏳ Crear turno de prueba
- [ ] ⏳ Hacer reserva de prueba
- [ ] ⏳ Probar en iPhone
- [ ] ⏳ Probar en Android
- [ ] ⏳ Probar botón WhatsApp
- [ ] ⏳ Verificar Firebase Console

### Deploy:
- [ ] ⏳ Subir código a GitHub
- [ ] ⏳ Conectar con Vercel
- [ ] ⏳ Agregar env vars en Vercel
- [ ] ⏳ Deploy a producción
- [ ] ⏳ Probar URL de producción

---

## 🎯 TESTING RÁPIDO

### Test 1: Sistema de Reservas (3 min)
```
1. Admin → Crear turno
   - Servicio: Soft Gel
   - Fecha: Mañana
   - Hora: 10:00
   
2. Home → Servicios → Soft Gel → Reservar
   - Seleccionar fecha de mañana
   - Debe aparecer 10:00 disponible
   - Completar datos
   - Confirmar
   
3. Admin → Reservas
   - Debe aparecer la nueva reserva
   - Cambiar estado a "confirmado"
   
✅ Si todo funciona = Sistema OK
```

### Test 2: Responsive (2 min)
```
1. Abrir en móvil (o F12 + device toolbar)
2. Verificar que:
   - Botones son grandes y fáciles de tocar
   - Textos son legibles
   - Servicios se ven bien en 1 columna
   - Modal de reserva se adapta bien
   - Admin funciona en móvil
   
✅ Si se ve bien = Responsive OK
```

### Test 3: Animaciones (1 min)
```
1. Pasar mouse sobre:
   - Botones → Deben hacer scale up
   - Cards de servicios → Deben elevarse
   - Horarios disponibles → Deben resaltarse
   
2. Hacer clic:
   - Debe haber feedback visual
   - Loading states en botones
   
✅ Si hay animaciones suaves = Animaciones OK
```

---

## 🔧 COMANDOS ÚTILES

```powershell
# Configurar WhatsApp
.\configurar-whatsapp.ps1

# Iniciar desarrollo
pnpm dev

# Ver en navegador
start http://localhost:3000

# Ver admin
start http://localhost:3000/admin

# Detener servidor
# Presiona Ctrl+C en la terminal

# Compilar producción
pnpm build

# Ver errores
pnpm lint

# Deploy a Vercel
pnpm vercel
```

---

## 📱 ACCESO DESDE CELULAR

### Wi-Fi Local:
1. Tu celular y PC deben estar en la misma WiFi
2. En el celular, abre Chrome/Safari
3. Ve a: http://169.254.83.107:3000
4. ¡Listo! Puedes probar todo

### Producción (después de deploy):
1. Deploy a Vercel
2. Obtendrás URL: https://tania-nails.vercel.app
3. Accede desde cualquier lugar del mundo

---

## 🎨 PERSONALIZACIÓN RÁPIDA

### Cambiar Colores:
```css
// En: app/globals.css
--color-primary: #ff2e91;     // Rosa principal
--color-secondary: #8b2eff;   // Morado
```

### Cambiar Logo:
```
1. Guarda tu logo en /public/logo.png
2. Edita components/header.tsx
3. Reemplaza placeholder-logo.svg por logo.png
```

### Agregar Servicio:
```typescript
// En: components/services.tsx
{
  name: "Nuevo Servicio",
  description: "Descripción del servicio",
  duration: "60 min",
  price: "$1200",
  image: "/mi-imagen.jpg",
}
```

---

## 🐛 PROBLEMAS COMUNES

### "No puedo acceder al admin"
```
Solución:
1. Contraseña: TaniaNails2024 (respeta mayúsculas)
2. Si cambiaste la contraseña, usa la nueva
3. Limpia cookies (Ctrl+Shift+Del)
```

### "WhatsApp no abre"
```
Solución:
1. Ejecuta: .\configurar-whatsapp.ps1
2. O edita manualmente los 5 archivos
3. Formato correcto: 59899123456 (sin espacios)
```

### "No se ve bien en móvil"
```
Solución:
1. Limpia caché: Ctrl+Shift+R
2. Verifica que el servidor esté corriendo
3. Prueba en modo incógnito
```

### "Animaciones no funcionan"
```
Solución:
1. Reinicia el servidor (Ctrl+C → pnpm dev)
2. Limpia caché del navegador
3. Verifica console (F12) por errores
```

---

## 📚 DOCUMENTACIÓN

### Para Configuración:
- `GUIA_CONFIGURACION.md` - Setup inicial completo
- Este archivo - Guía rápida de uso

### Para Desarrollo:
- `MEJORAS_IMPLEMENTADAS.md` - Detalles técnicos
- `RESUMEN_MEJORAS.md` - Overview de mejoras

### Scripts:
- `configurar-whatsapp.ps1` - Configuración automática
- `setup-check.ps1` - Verificación del sistema

---

## 🎉 ¡SIGUIENTE PASO!

### Ahora mismo:
```powershell
# 1. Configura tu WhatsApp
.\configurar-whatsapp.ps1

# 2. Abre la página
start http://localhost:3000

# 3. Prueba el sistema completo
```

### Esta semana:
1. Sube fotos reales de tus trabajos
2. Prueba en tu celular
3. Haz que amigas/clientes prueben
4. Ajusta lo que necesites

### Próxima semana:
1. Deploy a producción (Vercel)
2. Configura dominio propio (opcional)
3. Promueve en redes sociales
4. ¡Empieza a recibir reservas! 🎉

---

## 💡 TIPS PRO

### Seguridad:
- Cambia la contraseña admin regularmente
- No compartas la contraseña en redes sociales
- Usa contraseña fuerte (8+ caracteres)

### Marketing:
- Toma fotos profesionales de tus trabajos
- Actualiza Instagram con link a tu página
- Ofrece descuento por primera reserva online
- Comparte en grupos de Facebook locales

### Operación:
- Revisa admin diariamente
- Responde reservas en menos de 2 horas
- Crea turnos con 1 semana de anticipación
- Mantén actualizado el calendario

---

## 📞 NECESITAS AYUDA?

1. **Revisa la documentación:**
   - GUIA_CONFIGURACION.md
   - MEJORAS_IMPLEMENTADAS.md
   - RESUMEN_MEJORAS.md

2. **Verifica la consola:**
   - F12 en el navegador
   - Mira si hay errores en rojo

3. **Reinicia todo:**
   - Ctrl+C (detener servidor)
   - pnpm dev (iniciar de nuevo)
   - Limpia caché (Ctrl+Shift+R)

---

**🚀 ¡Tu página está lista! Solo falta configurar WhatsApp y ya puedes usarla en producción!**

**Comandos finales:**
```powershell
.\configurar-whatsapp.ps1  # Configura WhatsApp
start http://localhost:3000 # Abre la página
```

**¡Éxitos con Tania Nails! 💅✨**
