# 🔥 CREAR ÍNDICES EN FIREBASE - OBLIGATORIO

## 📋 Índices Necesarios

### 1️⃣ Para Turnos Disponibles (PRINCIPAL)
Este índice es **OBLIGATORIO** para que funcionen las reservas.

**Ve a Firebase Console:**
1. Abre https://console.firebase.google.com
2. Selecciona tu proyecto "tania-nails"
3. Ve a **Firestore Database** → **Indexes**
4. Click en **"Create Index"**
5. Configura así:
   - **Collection ID**: `turnos_disponibles`
   - **Fields to index**:
     - Campo 1: `fecha` → Ascending
     - Campo 2: `horario` → Ascending
   - Click en **"Create"**
6. Espera 2-5 minutos mientras se crea

### 2️⃣ Para Galería (OPCIONAL - Mejora rendimiento)
Si quieres que la galería cargue más rápido con filtros:

**Crear índice:**
- **Collection ID**: `galeria`
- **Fields to index**:
  - Campo 1: `categoria` → Ascending
  - Campo 2: `orden` → Ascending

### 3️⃣ Para Clientes (OPCIONAL - Para búsqueda rápida)
Si quieres búsqueda instantánea de clientes:

**Crear índice:**
- **Collection ID**: `clientes`
- **Fields to index**:
  - Campo 1: `whatsapp` → Ascending

## 🎯 ¿Cuáles son REALMENTE necesarios?

### Obligatorios (sin estos no funciona):
✅ **turnos_disponibles** (fecha + horario)

### Opcionales (funcionan sin ellos, pero más lento):
⭐ **galeria** (mejora filtros por categoría)
⭐ **clientes** (mejora autocompletar)

## 🆘 ¿Cómo sé si ya están creados?

1. Ve a Firebase Console → Firestore Database → Indexes
2. Verás una lista de índices
3. Debe aparecer:
   - `turnos_disponibles` con campos `fecha` y `horario`
4. Si dice "Building..." espera 2-5 minutos
5. Si dice "Enabled" → ✅ Listo

## ⚡ Atajos Rápidos

Si ya tienes Firebase abierto:

**Método 1 - Manual (Recomendado):**
Sigue los pasos de arriba

**Método 2 - Desde error:**
Si intentas usar la app sin índices, Firebase te mostrará un error con un link directo para crear el índice. Simplemente haz click en ese link.

## 📝 Notas

- Los índices se crean una sola vez
- Una vez creados, funcionan para siempre
- Firebase te avisará automáticamente si faltan más índices
- Puedes eliminar índices que no uses desde la consola

## ✅ LISTO - Una vez creados, recarga la app
