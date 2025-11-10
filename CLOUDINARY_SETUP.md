# 📸 Configuración de Cloudinary para Subida de Imágenes

## ¿Por qué Cloudinary?

Cloudinary es un servicio **GRATUITO** que permite:
- ✅ Subir imágenes directamente desde el celular
- ✅ Optimización automática (compresión, resize, WebP)
- ✅ No ocupar espacio en Firebase Storage (ahorro de costos)
- ✅ CDN global (imágenes cargan ultra rápido)
- ✅ 25GB gratis mensuales (suficiente para miles de fotos)

## 🚀 Pasos para Configurar

### 1. Crear Cuenta Gratis en Cloudinary

1. Ve a: https://cloudinary.com/users/register/free
2. Regístrate con email (recomendado usar Gmail)
3. Completa el registro (te pedirá nombre del "cloud")
4. Elige un nombre como: `tania-nails` o `tanianails`

### 2. Obtener Credenciales

Una vez dentro del Dashboard de Cloudinary:

1. En la página principal verás un cuadro llamado **"Account Details"**
2. Copia estos 3 valores:
   - **Cloud Name** (ejemplo: `tania-nails`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (ejemplo: `abcdefghijklmnopqrstuvwxyz123`)

### 3. Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Agrega estas líneas (reemplaza con tus valores reales):

\`\`\`env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tania-nails
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
\`\`\`

3. **IMPORTANTE**: Guarda el archivo y reinicia el servidor:
   \`\`\`bash
   # Ctrl+C para detener el servidor
   pnpm dev
   \`\`\`

## 🎨 Cómo Funciona

### Desde el Celular (Recomendado)

1. Tania abre `/admin` desde su celular
2. Va a la pestaña **"Galería"**
3. Click en **"Subir desde Celular"**
4. Toca el área de subida
5. Selecciona foto de la galería o toma nueva
6. La imagen se sube y optimiza automáticamente
7. Completa descripción y categoría
8. Click en **"Agregar Imagen"**

### Desde Computadora

Mismos pasos pero en lugar de tomar foto, selecciona archivo del disco.

### Con Link (Alternativa)

Si prefieres usar enlaces externos:

1. Sube la foto a Instagram
2. Click derecho en la foto → "Copiar dirección de imagen"
3. En el admin, cambia a **"Usar Link"**
4. Pega el URL
5. Completa y guarda

## ⚡ Optimizaciones Automáticas

Cloudinary aplica estas optimizaciones automáticamente:

- **Resize**: Todas las imágenes se redimensionan a 800x800px (perfecto para galería)
- **Calidad**: Compresión inteligente (mantiene calidad visual, reduce tamaño)
- **Formato**: Convierte a WebP automáticamente (50% más liviano que JPG)
- **CDN**: Las imágenes se distribuyen globalmente (carga rápida desde cualquier país)

### Ejemplo:

- **Imagen original**: 5MB, 4000x3000px, JPG
- **Imagen optimizada**: 150KB, 800x800px, WebP
- **Ahorro**: 97% menos peso, misma calidad visual

## 🔒 Seguridad

- ❌ **Nunca** compartas tu `API Secret` públicamente
- ✅ El archivo `.env.local` está en `.gitignore` (no se sube a GitHub)
- ✅ Solo Tania puede subir fotos (requiere acceso a `/admin`)

## 📊 Límites del Plan Gratis

- **Almacenamiento**: 25GB (aprox. 50,000 imágenes optimizadas)
- **Ancho de banda**: 25GB/mes (aprox. 100,000 vistas)
- **Transformaciones**: 25,000/mes (resize, crop, etc.)

Para un negocio de uñas, estos límites son **más que suficientes**.

## 🆘 Solución de Problemas

### Error: "CLOUDINARY_CLOUD_NAME is not defined"

**Solución**:
1. Verifica que `.env.local` existe en la raíz del proyecto
2. Verifica que las variables están escritas correctamente
3. Reinicia el servidor (`Ctrl+C` → `pnpm dev`)

### Error: "Invalid API key"

**Solución**:
1. Ve al Dashboard de Cloudinary
2. Verifica que copiaste bien las credenciales
3. No incluyas espacios al copiar
4. Asegúrate de que la cuenta esté activa

### Las imágenes no se ven

**Solución**:
1. Verifica que el URL de la imagen funciona (pégalo en el navegador)
2. Cloudinary puede tardar 1-2 segundos en procesar imágenes grandes
3. Revisa la consola del navegador (F12) para ver errores

## 📝 Notas Adicionales

- Las imágenes quedan almacenadas permanentemente en Cloudinary
- Puedes ver todas tus imágenes en: https://cloudinary.com/console/media_library
- Desde ahí también puedes eliminar fotos antiguas si necesitas espacio
- Cloudinary tiene app móvil para gestionar imágenes desde el celular

## 🎯 Próximos Pasos

Una vez configurado:

1. ✅ Sube 2-3 fotos de prueba desde el celular
2. ✅ Verifica que aparecen en la galería pública
3. ✅ Prueba los filtros por categoría
4. ✅ Elimina las fotos de prueba si quieres
5. ✅ Empieza a subir tus trabajos reales

---

**¿Necesitas ayuda?** Revisa la documentación de Cloudinary: https://cloudinary.com/documentation
