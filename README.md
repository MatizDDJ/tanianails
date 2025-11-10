# Tania Nails - Landing Page con Sistema de Reservas

Landing page moderna para salón de uñas con sistema completo de reservas integrado con Firebase.

## Características

- **Landing page moderna** con efectos neón y animaciones
- **Sistema de reservas en tiempo real** con Firebase Firestore
- **Panel de administración** para gestionar turnos y reservas
- **Integración con WhatsApp** para confirmación de reservas
- **Notificaciones toast** para feedback del usuario
- **Responsive** y optimizado para mobile

## Configuración de Firebase

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Activa Firestore Database en modo producción

### 2. Configurar variables de entorno

Crea las siguientes variables de entorno en tu proyecto de Vercel o archivo `.env.local`:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
\`\`\`

Puedes encontrar estos valores en:
- Firebase Console → Configuración del proyecto → Tus apps → SDK setup and configuration

### 3. Configurar Firestore

En Firebase Console, ve a Firestore Database y configura las siguientes reglas de seguridad:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de turnos disponibles
    match /turnos_disponibles/{document=**} {
      allow read: if true;
      allow write: if true; // Cambiar a auth != null en producción
    }
    
    // Permitir escritura de reservas por cualquier usuario
    match /reservas/{document=**} {
      allow read: if true; // Cambiar a auth != null en producción
      allow write: if true;
    }
  }
}
\`\`\`

**IMPORTANTE:** Para producción, deberías implementar Firebase Authentication y restringir las escrituras solo a usuarios autenticados.

## Estructura de la Base de Datos

### Colección: `turnos_disponibles`

Cada documento contiene:
\`\`\`typescript
{
  id: string,
  servicio: string,
  fecha: string, // formato: YYYY-MM-DD
  horario: string, // formato: HH:MM
  disponible: boolean
}
\`\`\`

### Colección: `reservas`

Cada documento contiene:
\`\`\`typescript
{
  id: string,
  nombre: string,
  whatsapp: string,
  servicio: string,
  fecha: string,
  horario: string,
  timestamp: Timestamp,
  estado: 'confirmado' | 'pendiente' | 'cancelado'
}
\`\`\`

## Uso

### Para clientes

1. Accede a la página principal
2. Navega a la sección "Servicios"
3. Selecciona un servicio y haz clic en "Reservar"
4. Elige una fecha y horario disponible
5. Completa tus datos (nombre y WhatsApp)
6. Confirma la reserva
7. Opcionalmente, continúa la conversación por WhatsApp

### Para la dueña del salón

1. Accede a `/admin` en tu navegador
2. En la pestaña "Turnos Disponibles":
   - Crea nuevos turnos seleccionando servicio, fecha y horario
   - Marca turnos como disponibles o no disponibles
   - Elimina turnos que ya no necesites
3. En la pestaña "Reservas":
   - Ve todas las reservas recibidas
   - Cambia el estado de las reservas (confirmar/cancelar)
   - Revisa los datos de contacto de los clientes

## Configuración del número de WhatsApp

Busca y reemplaza `598XXXXXXXX` con tu número de WhatsApp real en los siguientes archivos:
- `components/booking-modal.tsx`
- `components/whatsapp-button.tsx`
- `components/contact.tsx`
- `components/footer.tsx`

El formato debe ser: código de país + número sin espacios ni guiones
Ejemplo para Uruguay: `59899123456`

## Servicios incluidos

- Soft Gel - $1200 - 60 min
- Polygel - $1500 - 90 min
- Esculpidas - $1400 - 90 min
- Capping Gel - $900 - 45 min
- Esmaltado Semipermanente - $800 - 45 min
- Kapping - $1100 - 75 min
- Nail Art - desde $300 - 30-60 min
- Pedicuría - $1000 - 60 min

## Tecnologías utilizadas

- **Next.js 16** con App Router
- **React 19**
- **Firebase v12** (Firestore)
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Lucide React** icons
- **TypeScript**

## Próximas mejoras sugeridas

- [ ] Implementar Firebase Authentication para el panel admin
- [ ] Añadir calendario visual para selección de fechas
- [ ] Badges indicando días llenos
- [ ] Sistema de notificaciones por email
- [ ] Historial de reservas para clientes
- [ ] Integración con Google Calendar
- [ ] Sistema de recordatorios automáticos

## Soporte

Si necesitas ayuda con la configuración, contacta al desarrollador.

## Licencia

Proyecto privado para Tania Nails.
