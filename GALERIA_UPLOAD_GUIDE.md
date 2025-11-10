# 📸 Sistema de Galería con Subida de Imágenes - Guía Completa

## 🎯 Nuevas Funcionalidades Implementadas

### ✨ Subida Directa desde Celular
- Tania puede subir fotos directamente desde su galería
- También puede tomar fotos nuevas y subirlas al instante
- No necesita usar servicios externos como ImgBB

### 🚀 Optimización Automática
- Todas las imágenes se optimizan automáticamente
- **Resize**: Se redimensionan a 800x800px (perfecto para web)
- **Compresión**: Se reduce el peso hasta 90% sin perder calidad
- **Formato**: Convierte a WebP (formato moderno, más liviano)
- **CDN Global**: Las imágenes se sirven rápido desde cualquier país

### 📱 Dos Métodos de Subida

#### Método 1: Subir desde Celular (RECOMENDADO)
1. Ir a `/admin` → Pestaña "Galería"
2. Click en **"Subir desde Celular"**
3. Tocar el área de subida
4. Seleccionar foto de la galería o tomar nueva
5. Esperar 2-3 segundos mientras se optimiza
6. Ver mensaje "Imagen lista ✓"
7. Completar descripción y categoría
8. Click en **"Agregar Imagen"**

#### Método 2: Usar Link Externo (Alternativa)
1. Ir a `/admin` → Pestaña "Galería"
2. Click en **"Usar Link"**
3. Pegar URL de imagen (Instagram, ImgBB, etc.)
4. Completar descripción y categoría
5. Click en **"Agregar Imagen"**

## 🔧 Configuración Requerida

### Paso 1: Crear Cuenta Cloudinary (Gratis)

**¿Qué es Cloudinary?**
Es un servicio gratuito que:
- Almacena las imágenes en la nube
- Las optimiza automáticamente
- Las distribuye rápido globalmente
- Tiene plan gratis de 25GB (más que suficiente)

**Registro:**
1. Ve a: https://cloudinary.com/users/register/free
2. Regístrate con email
3. Elige nombre para tu "cloud" (ej: `tania-nails`)
4. Confirma email

### Paso 2: Obtener Credenciales

En el Dashboard de Cloudinary verás:

```
Cloud Name: tania-nails
API Key: 123456789012345
API Secret: abcdefg1234567890hijklmnop
```

### Paso 3: Configurar en el Proyecto

1. Abre el archivo `.env.local` (en la raíz del proyecto)
2. Agrega estas líneas (con TUS valores):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tania-nails
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefg1234567890hijklmnop
```

3. Guarda el archivo
4. Reinicia el servidor:
   ```bash
   # Presiona Ctrl+C para detener
   pnpm dev
   ```

### Paso 4: Crear Índice en Firebase

Para que la galería cargue correctamente:

1. Ve a Firebase Console → Firestore → Indexes
2. Create Index:
   - Collection: `galeria`
   - Campo: `orden` (Ascending)
3. Espera 2-5 minutos

## 🎨 Características de la Galería

### Filtros por Categoría
- 9 categorías disponibles:
  - Soft Gel
  - Polygel
  - Esculpidas
  - Capping Gel
  - Esmaltado Semipermanente
  - Kapping
  - Nail Art
  - Pedicuría

### Gestión de Orden
- Flechas arriba/abajo para reordenar
- Las imágenes aparecen en ese orden en la galería pública
- Útil para destacar trabajos más recientes

### Eliminación
- Botón de basura en cada imagen
- Confirmación antes de eliminar
- Se elimina de Firebase y Cloudinary

### Vista Pública
- Los usuarios ven la galería en la home
- Pueden filtrar por categoría
- Click en "Ver más en Instagram" abre tu perfil

## 📊 Especificaciones Técnicas

### Optimización de Imágenes

**Antes (imagen original):**
```
Archivo: foto.jpg
Tamaño: 5.2 MB
Dimensiones: 4032x3024px
Formato: JPEG
```

**Después (imagen optimizada):**
```
Archivo: foto.webp
Tamaño: 180 KB
Dimensiones: 800x800px
Formato: WebP
Ahorro: 96.5%
```

### Validaciones

- ✅ Formato: Solo imágenes (JPG, PNG, WebP, etc.)
- ✅ Tamaño máximo: 10MB por imagen
- ✅ Optimización automática a 800x800px
- ✅ Compresión inteligente (quality: auto)
- ✅ Conversión a WebP si navegador soporta

### API Endpoint

**POST `/api/upload`**
- Recibe: FormData con archivo
- Retorna: URL optimizada de Cloudinary
- Procesa: Resize + Compresión + WebP conversion

**DELETE `/api/upload`**
- Recibe: publicId de Cloudinary
- Retorna: Confirmación de eliminación
- Limpia: Imagen de Cloudinary

## 🔒 Seguridad

### Variables de Entorno
- ✅ `.env.local` en `.gitignore`
- ✅ No se sube a GitHub
- ✅ Solo accesible server-side

### Acceso Admin
- ✅ Solo quien sabe el easter egg (5 clicks en logo)
- ✅ Puede ser protegido con password en el futuro

### Cloudinary
- ✅ Carpeta dedicada: `tania-nails/`
- ✅ Transformaciones firmadas
- ✅ No expone API Secret al cliente

## 📱 Experiencia Móvil

### Optimizaciones
- Touch-friendly: Botones grandes (44px mínimo)
- Input file: Abre cámara nativa en móvil
- Loading states: Spinner mientras sube
- Feedback visual: "Imagen lista ✓"

### Flujo UX
1. **Click en área de subida**
   - iOS: Abre "Galería" o "Tomar foto"
   - Android: Abre selector de archivos
2. **Selecciona/Toma foto**
3. **Spinner animado** ("Subiendo imagen...")
4. **Success** ("Imagen lista ✓" en verde)
5. **Completa datos** (descripción, categoría)
6. **Guarda** → Aparece en galería pública

## 🆘 Troubleshooting

### Error: "CLOUDINARY_CLOUD_NAME is not defined"
**Solución:**
- Verifica que `.env.local` existe
- Verifica nombres de variables exactos
- Reinicia servidor (Ctrl+C → pnpm dev)

### Error: "File too large"
**Solución:**
- La imagen supera 10MB
- Comprímela antes de subir
- O aumenta límite en `app/api/upload/route.ts`

### Error: "Invalid file type"
**Solución:**
- Solo acepta imágenes
- Formatos válidos: JPG, PNG, GIF, WebP

### La imagen no aparece en galería
**Solución:**
- Verifica que completaste descripción y categoría
- Revisa Firebase Firestore → colección `galeria`
- Verifica índice creado (orden ASC)

### Imagen se demora en subir
**Solución:**
- Normal si la imagen es grande (>5MB)
- Cloudinary la está optimizando
- Puede tardar 5-10 segundos
- No cierres la pestaña mientras sube

## 📈 Métricas y Límites

### Plan Gratis Cloudinary
- **Almacenamiento**: 25GB
- **Ancho de banda**: 25GB/mes
- **Transformaciones**: 25,000/mes
- **Imágenes**: ~50,000 (aprox 500KB c/u)

### Uso Estimado
Con 100 imágenes optimizadas:
- **Espacio usado**: ~20MB (0.08% del límite)
- **Vistas/mes**: 10,000 × 180KB = 1.8GB (7% del límite)

**Conclusión**: Más que suficiente para el negocio.

## 🎯 Próximos Pasos

### Inmediatos
1. ✅ Configurar Cloudinary (5 minutos)
2. ✅ Crear índice en Firebase (2 minutos)
3. ✅ Subir 2-3 fotos de prueba
4. ✅ Verificar aparecen en galería pública
5. ✅ Eliminar fotos de prueba

### Recomendaciones
- 📸 Sube 10-15 trabajos destacados
- 🏷️ Usa categorías apropiadas
- 🎨 Ordena los mejores primero
- 🔄 Actualiza galería semanalmente
- 📱 Usa fotos de buena calidad

### Futuras Mejoras
- [ ] Editar imágenes existentes
- [ ] Subir múltiples a la vez
- [ ] Slider/lightbox en galería pública
- [ ] Compartir imagen en redes
- [ ] Watermark automático

## 📝 Resumen

| Característica | Estado | Descripción |
|---------------|--------|-------------|
| Subida desde celular | ✅ | Funciona desde cualquier dispositivo |
| Optimización automática | ✅ | Resize + Compresión + WebP |
| Método alternativo (URL) | ✅ | Para usar links externos |
| Gestión de orden | ✅ | Flechas arriba/abajo |
| Filtros categoría | ✅ | 9 categorías disponibles |
| Vista pública | ✅ | Aparece en home con filtros |
| Link a Instagram | ✅ | Botón directo a perfil |
| Eliminación | ✅ | Con confirmación |

---

**Documentos relacionados:**
- `CLOUDINARY_SETUP.md` - Guía detallada de Cloudinary
- `INDICES_FIREBASE.md` - Índices necesarios en Firebase
- `RESUMEN_IMPLEMENTACION.md` - Todas las funcionalidades del proyecto
