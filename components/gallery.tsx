"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { escucharImagenesGaleria, type ImagenGaleria } from "@/lib/firebase-services"

const galleryImagesDefault = [
  { id: "1", url: "/nail-art-pink-glitter.jpg", alt: "Nail art rosa", categoria: "Nail Art", orden: 0 },
  { id: "2", url: "/purple-ombre-nails.jpg", alt: "Uñas degradado morado", categoria: "Nail Art", orden: 1 },
  { id: "3", url: "/french-manicure-modern.jpg", alt: "Francesa moderna", categoria: "Esmaltado Semipermanente", orden: 2 },
  { id: "4", url: "/stiletto-nails-design.jpg", alt: "Uñas stiletto", categoria: "Esculpidas", orden: 3 },
  { id: "5", url: "/nude-nails-elegant.jpg", alt: "Uñas nude elegantes", categoria: "Soft Gel", orden: 4 },
  { id: "6", url: "/neon-nails-summer.jpg", alt: "Uñas neón verano", categoria: "Nail Art", orden: 5 },
  { id: "7", url: "/marble-nails-white.jpg", alt: "Uñas marmoladas", categoria: "Nail Art", orden: 6 },
  { id: "8", url: "/chrome-nails-metallic.jpg", alt: "Uñas chrome", categoria: "Nail Art", orden: 7 },
]

const categorias = [
  "Todos",
  "Soft Gel",
  "Polygel",
  "Esculpidas",
  "Capping Gel",
  "Esmaltado Semipermanente",
  "Kapping",
  "Nail Art",
  "Pedicuría",
]

export default function Gallery() {
  const [imagenes, setImagenes] = useState<ImagenGaleria[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = escucharImagenesGaleria((imagenesActualizadas) => {
      if (imagenesActualizadas.length > 0) {
        setImagenes(imagenesActualizadas)
      } else {
        // Si no hay imágenes en Firebase, mostrar las por defecto
        setImagenes(galleryImagesDefault as any)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const imagenesFiltradas =
    categoriaSeleccionada === "Todos"
      ? imagenes
      : imagenes.filter((img) => img.categoria === categoriaSeleccionada)
  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-black via-[#111111] to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-purple">Galería</h2>
          <p className="text-gray-400 text-lg mb-8">Inspirate con nuestros trabajos más recientes</p>

          {/* Filtros de categoría */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  categoriaSeleccionada === cat
                    ? "bg-[#8b2eff] text-white glow-purple"
                    : "bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#8b2eff]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#8b2eff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando galería...</p>
          </div>
        ) : imagenesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No hay imágenes en esta categoría</p>
            <Button
              onClick={() => setCategoriaSeleccionada("Todos")}
              className="bg-[#8b2eff] hover:bg-[#8b2eff]/90 text-white"
            >
              Ver todas
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagenesFiltradas.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#2a2a2a] hover:border-[#8b2eff] transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div>
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                    <p className="text-gray-300 text-xs">{image.categoria}</p>
                  </div>
                </div>
                <div className="absolute inset-0 glow-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            onClick={() => window.open("https://www.instagram.com/tania_nails.bfb/", "_blank")}
            size="lg"
            className="bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white glow-pink transform hover:scale-105 active:scale-95 transition-all"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Ver más en Instagram
          </Button>
        </div>
      </div>
    </section>
  )
}
