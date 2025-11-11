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
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const nextImage = () => {
    setDirection('right')
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setDirection('left')
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-[#ff2e91] transition-all duration-300 p-2 hover:bg-[#2a2a2a] rounded-lg z-10 hover:rotate-90 hover:scale-110 active:scale-95 animate-scale-in"
        aria-label="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Imagen principal */}
        <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${alt} - ${index + 1}`}
              className={`absolute max-w-full max-h-full object-contain rounded-lg transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
        </div>

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#111111]/80 hover:bg-[#ff2e91]/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border border-[#2a2a2a] hover:border-[#ff2e91] backdrop-blur-sm hover:glow-pink animate-slide-in-left z-20"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#111111]/80 hover:bg-[#ff2e91]/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border border-[#2a2a2a] hover:border-[#ff2e91] backdrop-blur-sm hover:glow-pink animate-slide-in-right z-20"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicadores */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 animate-fade-in z-20" style={{ animationDelay: '0.3s' }}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 'right' : 'left')
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-[#ff2e91] w-8 glow-pink" 
                    : "bg-gray-600 hover:bg-gray-500 hover:scale-125"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        <div className="absolute top-4 left-4 bg-[#111111]/80 text-white px-4 py-2 rounded-lg border border-[#2a2a2a] backdrop-blur-sm animate-slide-in-left z-20" style={{ animationDelay: '0.2s' }}>
          <span className="font-semibold">{currentIndex + 1}</span>
          <span className="text-gray-400"> / {images.length}</span>
        </div>

        {/* Info */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#111111]/80 text-white px-4 py-2 rounded-lg border border-[#2a2a2a] text-center backdrop-blur-sm animate-fade-in z-20" style={{ animationDelay: '0.4s' }}>
          <p className="font-semibold">{alt}</p>
          <p className="text-sm text-gray-400">{categoria}</p>
        </div>
      </div>
    </div>
  )
}
