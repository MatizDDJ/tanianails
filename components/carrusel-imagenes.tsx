"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

interface CarruselImagenesProps {
  images: string[]
  alt: string
  categoria: string
  onClose: () => void
}

export default function CarruselImagenes({ images, alt, categoria, onClose }: CarruselImagenesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-[#ff2e91] transition-all p-2 hover:bg-[#2a2a2a] rounded-lg z-10"
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Imagen principal */}
        <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`${alt} - ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg animate-zoom-in"
          />
        </div>

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#111111]/80 hover:bg-[#1a1a1a] text-white p-3 rounded-full transition-all hover:scale-110 active:scale-95 border border-[#2a2a2a]"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#111111]/80 hover:bg-[#1a1a1a] text-white p-3 rounded-full transition-all hover:scale-110 active:scale-95 border border-[#2a2a2a]"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicadores */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? "bg-[#ff2e91] w-8" 
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        <div className="absolute top-4 left-4 bg-[#111111]/80 text-white px-4 py-2 rounded-lg border border-[#2a2a2a]">
          <span className="font-semibold">{currentIndex + 1}</span>
          <span className="text-gray-400"> / {images.length}</span>
        </div>

        {/* Info */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#111111]/80 text-white px-4 py-2 rounded-lg border border-[#2a2a2a] text-center">
          <p className="font-semibold">{alt}</p>
          <p className="text-sm text-gray-400">{categoria}</p>
        </div>
      </div>
    </div>
  )
}
