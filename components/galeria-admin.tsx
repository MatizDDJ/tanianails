"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, Edit2, Instagram, Image as ImageIcon, ArrowUp, ArrowDown, Upload, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  crearImagenGaleria,
  actualizarImagenGaleria,
  eliminarImagenGaleria,
  escucharImagenesGaleria,
  type ImagenGaleria,
} from "@/lib/firebase-services"
import Toast from "@/components/toast"

const categorias = [
  "Soft Gel",
  "Polygel",
  "Esculpidas",
  "Capping Gel",
  "Esmaltado Semipermanente",
  "Kapping",
  "Nail Art",
  "Pedicuría",
]

export default function GaleriaAdmin() {
  const [imagenes, setImagenes] = useState<ImagenGaleria[]>([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [editando, setEditando] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [metodoSubida, setMetodoSubida] = useState<"archivo" | "url">("archivo")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagenesSubidas, setImagenesSubidas] = useState<string[]>([])

  const [nuevaImagen, setNuevaImagen] = useState({
    url: [] as string[],
    alt: "",
    categoria: "Nail Art",
    orden: 0,
  })

  useEffect(() => {
    const unsubscribe = escucharImagenesGaleria((imagenesActualizadas) => {
      setImagenes(imagenesActualizadas)
    })

    return () => unsubscribe()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Validar máximo 5 imágenes
    if (files.length + imagenesSubidas.length > 5) {
      setToast({ message: "Máximo 5 imágenes por publicación", type: "error" })
      return
    }

    setUploading(true)

    try {
      const urlsSubidas: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validar que sea imagen
        if (!file.type.startsWith('image/')) {
          setToast({ message: `${file.name} no es una imagen válida`, type: "error" })
          continue
        }

        // Validar tamaño (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setToast({ message: `${file.name} es muy grande (máximo 10MB)`, type: "error" })
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (data.success) {
          urlsSubidas.push(data.url)
        } else {
          throw new Error(data.error)
        }
      }

      setImagenesSubidas(prev => [...prev, ...urlsSubidas])
      setNuevaImagen(prev => ({ ...prev, url: [...prev.url, ...urlsSubidas] }))
      setToast({ message: `${urlsSubidas.length} imagen(es) subida(s) exitosamente`, type: "success" })
    } catch (error: any) {
      console.error("Error subiendo imágenes:", error)
      setToast({ message: "Error al subir imágenes: " + error.message, type: "error" })
    } finally {
      setUploading(false)
    }
  }

  const handleCrearImagen = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevaImagen.url || nuevaImagen.url.length === 0) {
      setToast({ message: "Debes subir al menos una imagen", type: "error" })
      return
    }

    try {
      // Si solo hay una imagen, guardarla como string, si hay múltiples como array
      const urlToSave = nuevaImagen.url.length === 1 ? nuevaImagen.url[0] : nuevaImagen.url

      await crearImagenGaleria({
        url: urlToSave,
        alt: nuevaImagen.alt || "Trabajo Tania Nails",
        categoria: nuevaImagen.categoria,
        orden: nuevaImagen.orden || imagenes.length,
      })

      setNuevaImagen({
        url: [],
        alt: "",
        categoria: "Nail Art",
        orden: 0,
      })

      setImagenesSubidas([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setToast({ message: "Imagen(es) agregada(s) exitosamente", type: "success" })
    } catch (error) {
      console.error("Error creando imagen:", error)
      setToast({ message: "Error al agregar la imagen", type: "error" })
    }
  }

  const handleEliminarImagenTemporal = (index: number) => {
    const nuevasUrls = nuevaImagen.url.filter((_, i) => i !== index)
    setNuevaImagen(prev => ({ ...prev, url: nuevasUrls }))
    setImagenesSubidas(nuevasUrls)
  }

  const handleEliminarImagen = async (id: string) => {
    if (!confirm("¿Estás segura de eliminar esta imagen?")) return

    try {
      await eliminarImagenGaleria(id)
      setToast({ message: "Imagen eliminada exitosamente", type: "success" })
    } catch (error) {
      console.error("Error eliminando imagen:", error)
      setToast({ message: "Error al eliminar la imagen", type: "error" })
    }
  }

  const handleCambiarOrden = async (id: string, direccion: "up" | "down") => {
    const imagen = imagenes.find((img) => img.id === id)
    if (!imagen) return

    const nuevoOrden = direccion === "up" ? imagen.orden - 1 : imagen.orden + 1

    try {
      await actualizarImagenGaleria(id, { orden: nuevoOrden })
    } catch (error) {
      console.error("Error actualizando orden:", error)
      setToast({ message: "Error al cambiar el orden", type: "error" })
    }
  }

  const irAInstagram = () => {
    window.open("https://www.instagram.com/tania_nails.bfb/", "_blank")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Botón Instagram */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-pink-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 flex items-center gap-2">
              <Instagram className="w-5 h-5 text-[#ff2e91]" />
              Ver todas tus publicaciones
            </h3>
            <p className="text-xs text-gray-400">
              Las fotos que subas aquí aparecerán en la galería de la web
            </p>
          </div>
          <Button
            onClick={irAInstagram}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs sm:text-sm px-4 py-2 w-full sm:w-auto"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Abrir Instagram
          </Button>
        </div>
      </div>

      {/* Formulario para agregar imagen */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2e91]" />
          Agregar Nueva Imagen
        </h2>
        <form onSubmit={handleCrearImagen} className="space-y-3 sm:space-y-4">
          {/* Selector de método de subida */}
          <div className="flex gap-2 p-1 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a]">
            <button
              type="button"
              onClick={() => setMetodoSubida("archivo")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                metodoSubida === "archivo"
                  ? "bg-[#8b2eff] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Subir desde</span> Celular
            </button>
            <button
              type="button"
              onClick={() => setMetodoSubida("url")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                metodoSubida === "url"
                  ? "bg-[#8b2eff] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Usar</span> Link
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Input para subir archivo */}
            {metodoSubida === "archivo" && (
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                  Selecciona imágenes (máximo 5)
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading || imagenesSubidas.length >= 5}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1a1a1a] border-2 border-dashed border-[#2a2a2a] rounded-lg cursor-pointer hover:border-[#8b2eff] transition-colors ${
                      uploading || imagenesSubidas.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#8b2eff] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-400">Subiendo imágenes...</span>
                      </>
                    ) : imagenesSubidas.length > 0 ? (
                      <>
                        <ImageIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-500">{imagenesSubidas.length} imagen(es) lista(s) ✓</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          Toca para seleccionar fotos
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview de imágenes subidas */}
                {imagenesSubidas.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {imagenesSubidas.map((url, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-[#2a2a2a]"
                        />
                        <button
                          type="button"
                          onClick={() => handleEliminarImagenTemporal(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  📱 Puedes seleccionar hasta 5 imágenes para crear un carrusel (máx 10MB cada una)
                </p>
              </div>
            )}

            {/* Input para URL */}
            {metodoSubida === "url" && (
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                  URL de la Imagen (una por línea para múltiples)
                </label>
                <textarea
                  value={nuevaImagen.url.join('\n')}
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').filter(url => url.trim())
                    setNuevaImagen({ ...nuevaImagen, url: urls })
                  }}
                  placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 min-h-[100px]"
                  rows={5}
                />
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Pega los links de ImgBB, Imgur o Instagram (máximo 5)
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Descripción
              </label>
              <Input
                type="text"
                value={nuevaImagen.alt}
                onChange={(e) => setNuevaImagen({ ...nuevaImagen, alt: e.target.value })}
                placeholder="Ej: Uñas stiletto rosa con glitter"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-sm h-10 sm:h-11"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Categoría
              </label>
              <select
                value={nuevaImagen.categoria}
                onChange={(e) => setNuevaImagen({ ...nuevaImagen, categoria: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm h-10 sm:h-11"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white text-sm sm:text-base py-2.5 sm:py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Imagen
          </Button>
        </form>
      </div>

      {/* Lista de imágenes */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2e91]" />
          Imágenes de la Galería ({imagenes.length})
        </h2>

        {imagenes.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No hay imágenes en la galería</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {imagenes.map((imagen) => {
              const imageUrl = Array.isArray(imagen.url) ? imagen.url[0] : imagen.url
              const imageCount = Array.isArray(imagen.url) ? imagen.url.length : 1
              
              return (
                <div
                  key={imagen.id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden hover:border-[#ff2e91] transition-all group"
                >
                  <div className="relative aspect-square">
                    <img
                      src={imageUrl}
                      alt={imagen.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                    {imageCount > 1 && (
                      <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        🎠 {imageCount} fotos
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCambiarOrden(imagen.id!, "up")}
                        className="p-2 bg-[#8b2eff] rounded-lg hover:bg-[#8b2eff]/80 transition-colors"
                        disabled={imagen.orden === 0}
                      >
                        <ArrowUp className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleEliminarImagen(imagen.id!)}
                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleCambiarOrden(imagen.id!, "down")}
                        className="p-2 bg-[#8b2eff] rounded-lg hover:bg-[#8b2eff]/80 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{imagen.alt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-1 rounded">
                        {imagen.categoria}
                      </span>
                      <span className="text-xs text-gray-500">Orden: {imagen.orden}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
