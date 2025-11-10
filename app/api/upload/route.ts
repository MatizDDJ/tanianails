import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Convertir el archivo a base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Subir a Cloudinary con optimizaciones automáticas
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tania-nails',
      transformation: [
        { width: 800, height: 800, crop: 'fill', quality: 'auto:good' },
        { fetch_format: 'auto' }, // Convierte automáticamente a WebP si el navegador lo soporta
      ],
      resource_type: 'auto',
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error: any) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen', details: error.message },
      { status: 500 }
    )
  }
}

// Endpoint para eliminar imagen de Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: 'No se proporcionó public_id' }, { status: 400 })
    }

    await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error)
    return NextResponse.json(
      { error: 'Error al eliminar imagen', details: error.message },
      { status: 500 }
    )
  }
}
