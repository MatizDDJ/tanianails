"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "María González",
    text: "Increíble experiencia! Las uñas me quedaron perfectas y duraron más de 3 semanas. Tania es una artista!",
    rating: 5,
    service: "Polygel + Nail Art",
  },
  {
    name: "Sofía Rodríguez",
    text: "El mejor salón de uñas de Montevideo. Siempre salgo feliz con mis diseños. 100% recomendado!",
    rating: 5,
    service: "Esculpidas",
  },
  {
    name: "Valentina Pérez",
    text: "Ambiente súper lindo y profesional. Tania se toma el tiempo para que queden perfectas. Volveré siempre!",
    rating: 5,
    service: "Soft Gel",
  },
  {
    name: "Lucía Martínez",
    text: "Quedé enamorada del nail art que me hizo! Super detallista y el resultado es espectacular.",
    rating: 5,
    service: "Nail Art",
  },
]

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex items-center py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff2e91]/10 to-[#8b2eff]/10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-pink">
            Lo que dicen nuestras clientas
          </h2>
          <p className="text-gray-400 text-lg">Experiencias reales de quienes confían en nosotras</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111111] rounded-2xl p-8 md:p-12 border border-[#2a2a2a] glow-pink">
            <div className="flex justify-center mb-6">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-[#ff2e91] fill-[#ff2e91]" />
              ))}
            </div>

            <p className="text-white text-xl md:text-2xl text-center mb-6 leading-relaxed">
              "{reviews[currentIndex].text}"
            </p>

            <div className="text-center">
              <p className="text-[#ff2e91] font-semibold text-lg">{reviews[currentIndex].name}</p>
              <p className="text-gray-400 text-sm">{reviews[currentIndex].service}</p>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-[#ff2e91] w-8" : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
