# Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase paso a paso para el sistema de reservas de Tania Nails.

## Paso 1: Crear cuenta y proyecto en Firebase

### 1.1 Crear cuenta
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Si es tu primera vez, acepta los términos y condiciones

### 1.2 Crear nuevo proyecto
1. Haz clic en "Agregar proyecto" o "Add project"
2. Nombre del proyecto: `tania-nails` (o el nombre que prefieras)
3. Desactiva Google Analytics (no es necesario para este proyecto)
4. Haz clic en "Crear proyecto"
5. Espera a que se cree el proyecto (toma unos segundos)

## Paso 2: Configurar Firestore Database

### 2.1 Crear base de datos
1. En el menú lateral, busca "Firestore Database"
2. Haz clic en "Crear base de datos" o "Create database"
3. Selecciona el modo:
   - **Modo de producción** (recomendado)
   - Ubicación: Elige la más cercana (por ejemplo: `southamerica-east1` para Brasil/Uruguay)
4. Haz clic en "Siguiente" y luego en "Habilitar"

### 2.2 Configurar reglas de seguridad
1. Ve a la pestaña "Reglas" en Firestore Database
2. Reemplaza el contenido con estas reglas:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Turnos disponibles: lectura pública, escritura temporal
    match /turnos_disponibles/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    // Reservas: lectura y escritura pública temporal
    match /reservas/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
\`\`\`

3. Haz clic en "Publicar"

⚠️ **IMPORTANTE**: Estas reglas permiten acceso público para desarrollo. Para producción, deberías implementar autenticación.

## Paso 3: Obtener las credenciales de Firebase

### 3.1 Registrar tu aplicación web
1. En la página principal de Firebase Console
2. Haz clic en el ícono web `</>` para agregar una aplicación web
3. Nombre de la app: `Tania Nails Web`
4. **NO** marques "Configurar Firebase Hosting"
5. Haz clic en "Registrar app"

### 3.2 Copiar las credenciales
Verás un código como este:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tania-nails.firebaseapp.com",
  projectId: "tania-nails",
  storageBucket: "tania-nails.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
\`\`\`

**COPIA** estos valores, los necesitarás para el siguiente paso.

## Paso 4: Configurar variables de entorno en Vercel

### 4.1 En v0 (si estás usando v0)
1. Haz clic en el menú de la izquierda (sidebar)
2. Ve a "Vars" (Variables de entorno)
3. Agrega cada una de estas variables:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY = tu-api-key-aquí
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID = tu-app-id
\`\`\`

### 4.2 En desarrollo local
Si estás trabajando localmente, crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tania-nails.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tania-nails
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tania-nails.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
\`\`\`

**⚠️ NUNCA** subas este archivo a Git.

## Paso 5: Verificar que funciona

### 5.1 Crear un turno de prueba
1. Ve a `/admin` en tu aplicación
2. Completa el formulario para crear un turno:
   - Servicio: Elige uno
   - Fecha: Selecciona mañana
   - Horario: Por ejemplo, 10:00
3. Haz clic en "Crear Turno"
4. Deberías ver el turno aparecer en la lista

### 5.2 Verificar en Firebase Console
1. Ve a Firestore Database en Firebase Console
2. Deberías ver la colección `turnos_disponibles`
3. Dentro, tu turno creado con todos los datos

### 5.3 Hacer una reserva de prueba
1. Ve a la página principal
2. Haz clic en "Reservar" en cualquier servicio
3. Selecciona la fecha donde creaste el turno
4. Deberías ver el horario disponible
5. Completa el formulario y confirma
6. Verifica que la reserva aparece en `/admin` pestaña "Reservas"

## Solución de problemas comunes

### Error: "Firebase: Error (auth/operation-not-allowed)"
- **Solución**: Verifica que las reglas de Firestore permitan escritura

### No aparecen los horarios disponibles
- **Solución**: 
  1. Verifica que creaste turnos en `/admin`
  2. Verifica que el turno tiene `disponible: true`
  3. Verifica que la fecha del turno es correcta

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"
- **Solución**: Ya está inicializado, no es un error crítico

### Los cambios no se ven en tiempo real
- **Solución**: 
  1. Refresca la página
  2. Verifica tu conexión a internet
  3. Verifica las reglas de Firestore

## Seguridad para producción

Cuando estés lista para producción, actualiza las reglas de Firestore:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /turnos_disponibles/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
    
    match /reservas/{document=**} {
      allow read: if request.auth != null;
      allow create: if true; // Permitir crear reservas
      allow update, delete: if request.auth != null;
    }
  }
}
\`\`\`

Luego implementa Firebase Authentication para el panel de admin.

## Recursos adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Guía de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)

## ¿Necesitas ayuda?

Si tienes problemas con la configuración, revisa:
1. Las variables de entorno están correctamente escritas
2. Las reglas de Firestore permiten lectura/escritura
3. La consola del navegador para ver errores específicos
