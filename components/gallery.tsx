"use client"

import { Button } from "@/components/ui/button"

const galleryImages = [
  { id: 1, url: "/nail-art-pink-glitter.jpg", alt: "Nail art rosa" },
  { id: 2, url: "/purple-ombre-nails.jpg", alt: "Uñas degradado morado" },
  { id: 3, url: "/french-manicure-modern.jpg", alt: "Francesa moderna" },
  { id: 4, url: "/stiletto-nails-design.jpg", alt: "Uñas stiletto" },
  { id: 5, url: "/nude-nails-elegant.jpg", alt: "Uñas nude elegantes" },
  { id: 6, url: "/neon-nails-summer.jpg", alt: "Uñas neón verano" },
  { id: 7, url: "/marble-nails-white.jpg", alt: "Uñas marmoladas" },
  { id: 8, url: "/chrome-nails-metallic.jpg", alt: "Uñas chrome" },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-black via-[#111111] to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-purple">Galería</h2>
          <p className="text-gray-400 text-lg">Inspirate con nuestros trabajos más recientes</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#2a2a2a] hover:border-[#8b2eff] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 glow-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => window.open("https://instagram.com/tanianails", "_blank")}
            className="bg-gradient-to-r from-[#ff2e91] to-[#8b2eff] hover:opacity-90 text-white px-8 py-6 text-lg"
          >
            Ver más en Instagram
          </Button>
        </div>
      </div>
    </section>
  )
}
