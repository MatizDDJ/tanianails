# 🔒 Reglas de Seguridad de Firestore

## Instrucciones

1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona tu proyecto "tania-nails"
3. Ve a **Firestore Database** → **Rules**
4. Reemplaza TODO el contenido con el código de abajo
5. Click en **"Publicar"**

## Código de Reglas

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Turnos disponibles - Lectura pública, escritura solo admin
    match /turnos_disponibles/{turnoId} {
      allow read: if true;
      allow write: if true; // Cambiar por autenticación si implementas login
    }
    
    // Reservas - Crear público, leer/modificar solo admin
    match /reservas/{reservaId} {
      allow read: if true;
      allow create: if true; // Cualquiera puede hacer reserva
      allow update, delete: if true; // Cambiar por autenticación
    }
    
    // Galería - Lectura pública, escritura solo admin
    match /galeria/{imagenId} {
      allow read: if true; // Todos pueden ver la galería
      allow write: if true; // Cambiar por autenticación si implementas login
    }
    
    // Clientes - Solo admin puede ver/modificar
    match /clientes/{clienteId} {
      allow read, write: if true; // Cambiar por autenticación
    }
  }
}
```

## ⚠️ Importante

Estas reglas permiten **acceso completo** a todos porque:
- No hay sistema de login implementado aún
- La página `/admin` está protegida por easter egg
- Es un negocio pequeño con bajo riesgo

## 🔐 Para Mayor Seguridad (Futuro)

Si quieres proteger el admin con autenticación:

```javascript
// Cambiar las reglas de write por:
allow write: if request.auth != null && request.auth.token.admin == true;
```

Pero necesitarás implementar:
- Firebase Authentication
- Sistema de login
- Asignar rol admin a tu usuario
