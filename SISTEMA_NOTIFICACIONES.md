# 🔔 Sistema de Notificaciones - Guía de Implementación

## 1. Notificaciones Push (PWA)

### ¿Qué son?
Notificaciones que aparecen en el dispositivo del usuario incluso cuando no está navegando en la página.

### Implementación

#### A. Configurar Service Worker
```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'confirm', title: 'Confirmar'},
      {action: 'close', title: 'Cerrar'}
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})
```

#### B. Solicitar Permiso al Usuario
```typescript
// lib/notifications.ts
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false
  }
  
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const subscribeUserToPush = async () => {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  })
  
  // Guardar subscription en Firestore
  await saveSubscription(subscription)
  return subscription
}
```

#### C. Enviar Notificaciones desde Firebase
```typescript
// lib/send-notification.ts
import { getMessaging, sendMessage } from 'firebase/messaging'

export const enviarNotificacionReserva = async (
  userId: string,
  datos: {
    titulo: string
    mensaje: string
    url: string
  }
) => {
  // Obtener tokens del usuario desde Firestore
  const tokens = await getUserTokens(userId)
  
  const payload = {
    notification: {
      title: datos.titulo,
      body: datos.mensaje,
      click_action: datos.url
    }
  }
  
  // Enviar a todos los dispositivos del usuario
  await Promise.all(
    tokens.map(token => 
      sendMessage({ token, payload })
    )
  )
}
```

### Casos de Uso para Tania Nails:
1. **Recordatorio de turno** (24h antes)
2. **Confirmación de reserva** (inmediato)
3. **Promociones especiales** (manual)
4. **Nuevas imágenes en galería** (automático)

---

## 2. Notificaciones Automáticas (Email/SMS)

### Opción A: SendGrid (Email)

#### Instalación
```bash
npm install @sendgrid/mail
```

#### Configuración
```typescript
// lib/email-notifications.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const enviarEmailConfirmacion = async (
  destinatario: string,
  datosReserva: {
    nombre: string
    servicio: string
    fecha: string
    horario: string
  }
) => {
  const msg = {
    to: destinatario,
    from: 'reservas@tanianails.com', // Email verificado en SendGrid
    subject: '✨ Reserva confirmada en Tania Nails',
    text: `Hola ${datosReserva.nombre}!`,
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff2e91;">¡Reserva Confirmada! ✨</h1>
        <p>Hola <strong>${datosReserva.nombre}</strong>,</p>
        <p>Tu reserva ha sido confirmada exitosamente:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
          <p><strong>Servicio:</strong> ${datosReserva.servicio}</p>
          <p><strong>Fecha:</strong> ${datosReserva.fecha}</p>
          <p><strong>Horario:</strong> ${datosReserva.horario}</p>
        </div>
        <p>¡Nos vemos pronto! 💅</p>
        <p>- Equipo Tania Nails</p>
      </div>
    `
  }
  
  await sgMail.send(msg)
}
```

#### Uso en booking-modal.tsx
```typescript
// Después de crear la reserva
await crearReserva(...)
await enviarEmailConfirmacion(formData.email, {
  nombre: formData.name,
  servicio: formData.service,
  fecha: formData.date,
  horario: formData.time
})
```

### Opción B: Twilio (SMS)

#### Instalación
```bash
npm install twilio
```

#### Configuración
```typescript
// lib/sms-notifications.ts
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export const enviarSMSConfirmacion = async (
  telefono: string,
  datosReserva: {
    nombre: string
    servicio: string
    fecha: string
    horario: string
  }
) => {
  await client.messages.create({
    body: `Hola ${datosReserva.nombre}! Tu reserva en Tania Nails está confirmada:\n${datosReserva.servicio}\n${datosReserva.fecha} a las ${datosReserva.horario}\nNos vemos pronto! 💅`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+598${telefono}`
  })
}
```

### Opción C: Firebase Cloud Functions (Automático)

#### Recordatorio automático 24h antes
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const recordatorioTurno = functions.pubsub
  .schedule('every day 10:00')
  .onRun(async (context) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    
    // Obtener reservas de mañana
    const reservas = await admin.firestore()
      .collection('reservas')
      .where('fecha', '==', tomorrowStr)
      .where('estado', '==', 'confirmado')
      .get()
    
    // Enviar notificación a cada cliente
    for (const doc of reservas.docs) {
      const reserva = doc.data()
      await enviarNotificacion(reserva.whatsapp, {
        titulo: '⏰ Recordatorio de turno',
        mensaje: `Hola ${reserva.nombre}! Mañana tienes turno a las ${reserva.horario} para ${reserva.servicio}`
      })
    }
    
    return null
  })
```

---

## 3. Sistema Completo Recomendado

### Flujo de Notificaciones

1. **Cliente reserva turno** →
   - ✅ Email de confirmación (SendGrid)
   - ✅ WhatsApp automático (Twilio)
   - ✅ Notificación push (si está suscrito)

2. **24 horas antes** →
   - ⏰ Email de recordatorio
   - ⏰ SMS de recordatorio
   - ⏰ Push notification

3. **2 horas antes** →
   - ⚠️ SMS final de recordatorio

4. **Después del turno** →
   - ⭐ Email pidiendo reseña
   - 💝 Descuento para próxima visita

### Costos Estimados

- **SendGrid**: Gratis hasta 100 emails/día
- **Twilio SMS**: ~$0.01 USD por SMS (Uruguay)
- **Firebase Cloud Functions**: Gratis hasta 2M invocaciones/mes
- **Push Notifications**: Gratis (solo infraestructura)

### Configuración Inicial

1. Crear cuentas:
   - SendGrid: https://sendgrid.com
   - Twilio: https://twilio.com
   
2. Variables de entorno (.env.local):
```env
# SendGrid
SENDGRID_API_KEY=SG.xxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+xxx

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxx
VAPID_PRIVATE_KEY=xxx
```

3. Desplegar Firebase Functions:
```bash
cd functions
npm install
firebase deploy --only functions
```

---

## 4. Implementación Prioritaria

### Fase 1 (Ahora): Email Básico
- ✅ Confirmación de reserva por email
- Fácil de implementar
- Bajo costo

### Fase 2 (Próxima): SMS Automático
- ⏰ Recordatorio 24h antes
- Alta tasa de lectura
- Costo moderado

### Fase 3 (Futuro): Push Notifications
- 🔔 Notificaciones en tiempo real
- Mejor engagement
- Requiere PWA completo

¿Quieres que implemente alguna de estas opciones ahora?
