# 🎯 GUÍA COMPLETA DE CONFIGURACIÓN - TANIA NAILS

## ✅ PASO 1: CONFIGURAR FIREBASE (OBLIGATORIO)

### 1.1 Crear Proyecto en Firebase
1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombre: `tania-nails` (o el que prefieras)
4. Desactiva Google Analytics (no necesario)
5. Clic en "Crear proyecto"

### 1.2 Activar Firestore Database
1. En el menú lateral → "Firestore Database"
2. Clic en "Crear base de datos"
3. Modo: **Producción**
4. Ubicación: `southamerica-east1` (más cercana a Uruguay)
5. Clic en "Habilitar"

### 1.3 Configurar Reglas de Seguridad de Firestore
1. Ve a la pestaña "Reglas"
2. Copia y pega esto:

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

3. Clic en "Publicar"

### 1.4 Obtener Credenciales de Firebase
1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. Baja hasta "Tus apps"
3. Clic en el ícono `</>` (Web)
4. Nombre de la app: "Tania Nails Web"
5. NO marques "Firebase Hosting"
6. Clic en "Registrar app"
7. **COPIA** las credenciales que aparecen

Verás algo como:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
  authDomain: "tania-nails.firebaseapp.com",
  projectId: "tania-nails",
  storageBucket: "tania-nails.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
};
```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjak8_jz5hmU-CTbqkJtgooV7bu0-ic1Q",
  authDomain: "tania-nails.firebaseapp.com",
  projectId: "tania-nails",
  storageBucket: "tania-nails.firebasestorage.app",
  messagingSenderId: "755372284915",
  appId: "1:755372284915:web:b46fe50910a24fec429086"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
### 1.5 Configurar Variables de Entorno
1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tania-nails.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tania-nails
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tania-nails.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
```

⚠️ **IMPORTANTE**: Usa TUS valores reales, no los de ejemplo

---

## ✅ PASO 2: CONFIGURAR WHATSAPP (OBLIGATORIO)

Debes reemplazar el número de WhatsApp en 4 archivos:

### Busca `598XXXXXXXX` y reemplázalo con tu número real

Formato: código país + número (sin espacios, sin guiones)
Ejemplo Uruguay: `59899123456`

**Archivos a editar:**
1. `components/booking-modal.tsx`
2. `components/whatsapp-button.tsx`
3. `components/contact.tsx`
4. `components/footer.tsx`

---

## ✅ PASO 3: EJECUTAR EL PROYECTO

### 3.1 Instalar dependencias (ya hecho)
```bash
pnpm install
```

### 3.2 Ejecutar en modo desarrollo
```bash
pnpm dev
```

El proyecto estará disponible en: http://localhost:3000

---

## 📋 VERIFICAR QUE TODO FUNCIONA

### Test 1: Crear un turno disponible
1. Ve a http://localhost:3000/admin
2. En "Turnos Disponibles" completa:
   - Servicio: Soft Gel
   - Fecha: Mañana (cualquier fecha futura)
   - Horario: 10:00
3. Clic en "Crear Turno"
4. Deberías ver el turno en la lista

### Test 2: Verificar en Firebase
1. Ve a Firebase Console → Firestore Database
2. Deberías ver la colección "turnos_disponibles"
3. Dentro, tu turno con los datos

### Test 3: Hacer una reserva
1. Ve a http://localhost:3000 (página principal)
2. En "Servicios" busca "Soft Gel"
3. Clic en "Reservar"
4. Selecciona la fecha donde creaste el turno
5. Deberías ver el horario 10:00 disponible
6. Completa:
   - Nombre: Tu nombre
   - WhatsApp: Tu número
7. Confirma la reserva
8. Deberías ver un mensaje de éxito

### Test 4: Verificar la reserva
1. Ve a http://localhost:3000/admin
2. Pestaña "Reservas"
3. Deberías ver tu reserva con todos los datos

---

## 🔗 CONEXIONES DEL SISTEMA

### Arquitectura del Proyecto:

```
┌─────────────────┐
│   FRONTEND      │
│   (Next.js)     │
└────────┬────────┘
         │
         │ Firebase SDK
         ↓
┌─────────────────┐
│   FIREBASE      │
│   Firestore     │
└─────────────────┘
         │
         ├─ Colección: turnos_disponibles
         └─ Colección: reservas
```

### 1. Conexión Firebase ↔ Frontend
- **Archivo**: `lib/firebase.ts`
- **Función**: Inicializa Firebase con las credenciales
- **Variables**: Lee de `.env.local`

### 2. Servicios de Firebase
- **Archivo**: `lib/firebase-services.ts`
- **Funciones principales**:
  - `crearTurno()` - Crea turnos disponibles
  - `obtenerTurnosDisponibles()` - Lee turnos disponibles
  - `crearReserva()` - Guarda reservas de clientes
  - `obtenerReservas()` - Lee todas las reservas
  - `actualizarReserva()` - Cambia estado de reservas
  - `escucharTurnos()` - Escucha cambios en tiempo real
  - `escucharReservas()` - Escucha cambios en tiempo real

### 3. Componentes que usan Firebase

#### A) Página Admin (`app/admin/page.tsx`)
- **Lee**: turnos_disponibles, reservas
- **Escribe**: turnos_disponibles, reservas
- **Permisos**: Debe poder leer y escribir ambas colecciones

#### B) Modal de Reservas (`components/booking-modal.tsx`)
- **Lee**: turnos_disponibles (solo disponibles)
- **Escribe**: reservas
- **Acción**: Cuando cliente hace una reserva

#### C) Servicios (`components/services.tsx`)
- **Lee**: Nada (solo muestra servicios estáticos)
- **Acción**: Abre el modal de reservas

### 4. Conexión WhatsApp
- **Método**: Link directo a WhatsApp Web/App
- **Formato URL**: `https://wa.me/[NÚMERO]?text=[MENSAJE]`
- **Componentes que lo usan**:
  - `booking-modal.tsx` - Después de reservar
  - `whatsapp-button.tsx` - Botón flotante
  - `contact.tsx` - Sección contacto
  - `footer.tsx` - Footer

---

## 🚀 DESPLEGAR EN PRODUCCIÓN (VERCEL)

### Opción A: Desde Vercel Dashboard
1. Ve a https://vercel.com
2. "New Project"
3. Importa tu repositorio de GitHub
4. En "Environment Variables" agrega todas las de Firebase:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Deploy

### Opción B: Desde terminal
```bash
pnpm vercel
```

---

## 🛠️ COMANDOS ÚTILES

```bash
# Desarrollo
pnpm dev          # Ejecuta en modo desarrollo

# Producción
pnpm build        # Compila para producción
pnpm start        # Ejecuta versión compilada

# Linting
pnpm lint         # Revisa errores de código
```

---

## 📱 FUNCIONALIDADES DEL SISTEMA

### Para Clientes:
1. Ver servicios disponibles
2. Reservar turnos en fechas/horarios disponibles
3. Recibir confirmación
4. Continuar conversación por WhatsApp

### Para la Dueña (Admin):
1. Crear turnos disponibles por servicio
2. Ver todas las reservas recibidas
3. Cambiar estado de reservas (confirmar/cancelar)
4. Ver datos de contacto de clientes
5. Eliminar turnos que no necesite

---

## ⚠️ PROBLEMAS COMUNES

### "Error: No Firebase App '[DEFAULT]' has been created"
**Solución**: Las variables de entorno no están configuradas
- Verifica que `.env.local` existe
- Verifica que los valores son correctos
- Reinicia el servidor (`pnpm dev`)

### "Permission denied" en Firestore
**Solución**: Las reglas de Firestore no permiten acceso
- Ve a Firebase Console → Firestore → Reglas
- Copia las reglas del PASO 1.3
- Publica las reglas

### No aparecen horarios disponibles
**Solución**: No hay turnos creados o no están marcados como disponibles
- Ve a `/admin`
- Crea turnos con "Disponible" activado
- Verifica que la fecha sea futura

### WhatsApp no abre correctamente
**Solución**: El número está mal configurado
- Formato correcto: `59899123456` (sin espacios)
- Incluye código de país
- Sin símbolos (+, -, espacios)

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica Firebase Console para ver los datos
3. Asegúrate que todas las variables de entorno están configuradas

---

## ✨ PRÓXIMOS PASOS (OPCIONAL)

- [ ] Agregar autenticación para el panel admin
- [ ] Integrar con Google Calendar
- [ ] Añadir notificaciones por email
- [ ] Crear sistema de recordatorios automáticos
- [ ] Agregar más servicios o modificar precios

---

**¡Listo para empezar! 🎉**

Sigue los pasos en orden y tu sistema estará funcionando en minutos.
