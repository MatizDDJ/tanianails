# 🔍 DIAGNÓSTICO DE PROBLEMAS - RESERVAS

## ❌ NO PUEDO HACER RESERVAS

Vamos a revisar paso a paso qué puede estar fallando:

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### 1. ✅ Verificar que Firebase está configurado

Abre la consola del navegador (F12) y busca errores relacionados con Firebase.

**Errores comunes:**
- `"No Firebase App '[DEFAULT]' has been created"` → Variables de entorno mal configuradas
- `"Permission denied"` → Reglas de Firestore incorrectas
- `"Network error"` → Problema de conexión

---

### 2. ✅ Verificar Variables de Entorno

**Paso 1:** Verifica que `.env.local` existe y tiene los valores correctos:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDjak8_jz5hmU-CTbqkJtgooV7bu0-ic1Q
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tania-nails.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tania-nails
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tania-nails.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=755372284915
NEXT_PUBLIC_FIREBASE_APP_ID=1:755372284915:web:b46fe50910a24fec429086
```

**Paso 2:** Si modificaste `.env.local`, REINICIA el servidor:
```powershell
# Presiona Ctrl+C en la terminal
# Luego ejecuta:
pnpm dev
```

---

### 3. ✅ Verificar Reglas de Firestore

**Ve a Firebase Console:**
1. https://console.firebase.google.com/
2. Selecciona proyecto "tania-nails"
3. Firestore Database → Reglas
4. Verifica que tengas esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /turnos_disponibles/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    match /reservas/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

5. Clic en "Publicar" si hiciste cambios

---

### 4. ✅ Verificar que HAY TURNOS DISPONIBLES

**El problema más común:**
No puedes hacer reservas porque NO HAY TURNOS CREADOS.

**Solución:**
1. Ve a http://localhost:3000/admin
2. Contraseña: `TaniaNails2024`
3. En "Crear Nuevo Turno" completa:
   - **Servicio:** Soft Gel
   - **Fecha:** Elige MAÑANA (fecha futura)
   - **Horario:** 10:00
4. Clic en "Crear Turno"
5. Verifica que aparece en la lista con estado "Disponible" (verde)

**Ahora prueba hacer reserva:**
1. Ve a http://localhost:3000
2. Scroll a "Servicios"
3. Busca "Soft Gel"
4. Clic en "Reservar"
5. Selecciona la fecha de MAÑANA
6. Debería aparecer "10:00" como horario disponible

---

### 5. ✅ Verificar la Consola del Navegador

**Abre la consola mientras intentas hacer reserva:**
1. Presiona F12
2. Ve a la pestaña "Console"
3. Intenta hacer una reserva
4. Busca errores en ROJO

**Errores comunes y soluciones:**

#### Error: "Missing or insufficient permissions"
```
Solución:
- Ve a Firebase Console → Firestore → Reglas
- Copia las reglas del punto 3
- Publica
```

#### Error: "No se encontraron turnos disponibles"
```
Solución:
- Ve al admin y crea turnos
- Asegúrate que la fecha sea FUTURA
- Marca como "Disponible"
```

#### Error: "Network request failed"
```
Solución:
- Verifica tu conexión a internet
- Verifica que Firebase está activo
```

---

## 🔧 SOLUCIÓN RÁPIDA (PASO A PASO)

### PASO 1: Reiniciar Servidor
```powershell
# En la terminal donde corre el servidor:
# Presiona Ctrl+C
# Luego:
pnpm dev
```

### PASO 2: Verificar Firebase Console
```
1. Ve a: https://console.firebase.google.com/
2. Proyecto: tania-nails
3. Firestore Database
4. ¿Ves las colecciones "turnos_disponibles" y "reservas"?
   - SI: Bien, continúa
   - NO: Crea un turno primero
```

### PASO 3: Crear Turno de Prueba
```
1. http://localhost:3000/admin (contraseña: TaniaNails2024)
2. Crear Turno:
   - Servicio: Soft Gel
   - Fecha: [MAÑANA - fecha futura]
   - Horario: 10:00
3. Clic "Crear Turno"
4. ¿Aparece en la lista? SI = bien
```

### PASO 4: Hacer Reserva de Prueba
```
1. http://localhost:3000
2. Servicios → Soft Gel → Reservar
3. Fecha: [MAÑANA - misma fecha del turno]
4. ¿Aparece 10:00 disponible?
   - SI: Completa formulario y reserva
   - NO: Revisa consola (F12) por errores
```

---

## 🐛 ERRORES ESPECÍFICOS Y SOLUCIONES

### Error 1: "No aparecen horarios disponibles"

**Causas posibles:**
- ❌ No hay turnos creados
- ❌ La fecha seleccionada no tiene turnos
- ❌ Los turnos están marcados como "No disponible"
- ❌ La fecha del turno ya pasó

**Solución:**
```
1. Ve al admin
2. Pestaña "Turnos"
3. Verifica que:
   - Hay turnos creados
   - Están en verde (disponibles)
   - La fecha es FUTURA
   - El servicio coincide
```

### Error 2: "Error al crear la reserva"

**Causas posibles:**
- ❌ Reglas de Firestore incorrectas
- ❌ Variables de entorno mal configuradas
- ❌ Problema de red

**Solución:**
```
1. F12 → Console → Ver error específico
2. Verifica reglas de Firestore
3. Verifica .env.local
4. Reinicia servidor
```

### Error 3: "No se puede conectar a Firebase"

**Causas posibles:**
- ❌ Variables de entorno incorrectas
- ❌ Proyecto Firebase no existe
- ❌ Sin conexión a internet

**Solución:**
```
1. Verifica .env.local tenga TODOS los valores
2. Verifica en Firebase Console que el proyecto existe
3. Reinicia el servidor (Ctrl+C → pnpm dev)
```

---

## 📊 VERIFICACIÓN COMPLETA

Ejecuta este test completo:

### Test 1: Backend (Admin)
```
☐ Puedo acceder a /admin
☐ Puedo crear un turno
☐ El turno aparece en la lista
☐ Puedo marcarlo como disponible/no disponible
☐ Puedo eliminarlo
```

### Test 2: Frontend (Cliente)
```
☐ Puedo ver los servicios
☐ Puedo abrir el modal de reserva
☐ Puedo seleccionar una fecha
☐ Aparecen horarios disponibles
☐ Puedo seleccionar un horario
☐ Puedo completar el formulario
☐ Puedo confirmar la reserva
☐ Veo mensaje de éxito
```

### Test 3: Integración
```
☐ La reserva aparece en admin
☐ El turno se marca como "No disponible"
☐ Ya no aparece en la lista de horarios
☐ Puedo cambiar el estado de la reserva
```

---

## 🚨 SI NADA FUNCIONA

### Solución Nuclear (Resetear todo):

```powershell
# 1. Detener servidor
# Ctrl+C

# 2. Verificar .env.local tiene las credenciales correctas

# 3. Limpiar caché
Remove-Item -Recurse -Force .next

# 4. Reinstalar dependencias
pnpm install

# 5. Iniciar de nuevo
pnpm dev
```

### Verificar Firebase Console:

```
1. Ve a: https://console.firebase.google.com/
2. Proyecto: tania-nails
3. Firestore Database
4. ¿Ves datos ahí?
   - SI: El problema es en el frontend
   - NO: El problema es en Firebase
```

---

## 📞 DEBUGGING MANUAL

### Abre la consola (F12) y ejecuta:

```javascript
// Verifica configuración de Firebase
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

// Nota: En producción deberías verlas, en dev pueden aparecer como undefined en consola
```

### En la pestaña Network (F12):
```
1. Abre Network
2. Filtra por "firestore"
3. Intenta hacer una reserva
4. ¿Ves requests a firestore.googleapis.com?
   - SI: Mira el status (200 = OK, 403 = permisos)
   - NO: Firebase no está inicializado
```

---

## ✅ CHECKLIST FINAL

Antes de declarar que "no funciona", verifica:

- [ ] ✅ .env.local existe y tiene las 6 variables
- [ ] ✅ Servidor reiniciado después de cambiar .env.local
- [ ] ✅ Reglas de Firestore publicadas correctamente
- [ ] ✅ HAY turnos creados en el admin
- [ ] ✅ Los turnos son de FECHAS FUTURAS
- [ ] ✅ Los turnos están marcados como "Disponible"
- [ ] ✅ La fecha seleccionada coincide con turnos existentes
- [ ] ✅ El servicio seleccionado tiene turnos
- [ ] ✅ No hay errores en la consola (F12)
- [ ] ✅ Firebase Console muestra el proyecto activo

---

## 🎯 SOLUCIÓN MÁS PROBABLE

**El 90% de las veces el problema es:**

### NO HAY TURNOS DISPONIBLES

**Solución en 30 segundos:**
```
1. http://localhost:3000/admin
2. Crear Turno:
   - Servicio: Soft Gel
   - Fecha: [FECHA FUTURA - ej: mañana]
   - Horario: 14:00
3. Crear Turno
4. Verificar que está en VERDE (disponible)
5. Ir a la página principal
6. Servicios → Soft Gel → Reservar
7. Seleccionar la MISMA FECHA
8. Debe aparecer 14:00 disponible
9. Completar y reservar
10. ✅ FUNCIONA
```

---

## 📝 REPORTE DE ERROR

Si aún no funciona, necesito que me digas:

1. ¿Qué error específico ves en la consola (F12)?
2. ¿Puedes acceder al admin?
3. ¿Puedes crear turnos?
4. ¿Los turnos aparecen en Firebase Console?
5. ¿Qué pasa exactamente cuando intentas reservar?
   - No aparece el modal
   - No aparecen horarios
   - Da error al confirmar
   - Otro

---

**EJECUTA ESTO PRIMERO:**
```
1. Admin → Crear turno para MAÑANA
2. Página principal → Intentar reservar
3. Si no aparece el horario → Presiona F12 → Console → Captura el error
```

**¡Dime exactamente qué error ves y te ayudo a solucionarlo!** 🔧
