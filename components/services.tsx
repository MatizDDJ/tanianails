"use client"

import { useState } from "react"
import { Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookingModal from "@/components/booking-modal"

const services = [
  {
    name: "Soft Gel",
    description: "Uñas flexibles y naturales con acabado brillante que cuida tu uña natural.",
    duration: "60 min",
    price: "$1200",
    image: "/soft-gel-nails-pink.jpg",
  },
  {
    name: "Polygel",
    description: "Lo mejor del acrílico y gel. Ligero, resistente y perfecto para extensiones.",
    duration: "90 min",
    price: "$1500",
    image: "/polygel-nails-purple.jpg",
  },
  {
    name: "Esculpidas",
    description: "Uñas de acrílico clásicas, fuertes y duraderas para cualquier longitud.",
    duration: "90 min",
    price: "$1400",
    image: "/acrylic-sculpted-nails.jpg",
  },
  {
    name: "Capping Gel",
    description: "Protección y fortalecimiento de tus uñas naturales con gel.",
    duration: "45 min",
    price: "$900",
    image: "/gel-capping-nails.jpg",
  },
  {
    name: "Esmaltado Semipermanente",
    description: "Color perfecto que dura hasta 3 semanas sin descascararse.",
    duration: "45 min",
    price: "$800",
    image: "/gel-polish-manicure.jpg",
  },
  {
    name: "Kapping",
    description: "Técnica avanzada para uñas perfectas y duraderas.",
    duration: "75 min",
    price: "$1100",
    image: "/kapping-nails-technique.jpg",
  },
  {
    name: "Nail Art",
    description: "Diseños personalizados que reflejan tu estilo único. ¡Dale vida a tus uñas!",
    duration: "30-60 min",
    price: "desde $300",
    image: "/nail-art-design-colorful.jpg",
  },
  {
    name: "Pedicuría",
    description: "Tratamiento completo para pies suaves, lindos y saludables.",
    duration: "60 min",
    price: "$1000",
    image: "/pedicure-spa.png",
  },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  return (
    <section id="services" className="py-12 sm:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 text-glow-pink">Nuestros Servicios</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Técnicas de última generación para que tus uñas luzcan perfectas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div
              key={service.name}
              className="group bg-[#111111] rounded-2xl overflow-hidden border border-[#2a2a2a] hover:border-[#ff2e91] transition-all duration-300 hover:glow-pink animate-fade-in-up transform hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#ff2e91] transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">{service.description}</p>

                <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-[#8b2eff]">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#ff2e91] font-semibold">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{service.price}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedService(service.name)}
                  className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base py-5 sm:py-6"
                >
                  Reservar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && <BookingModal serviceName={selectedService} onClose={() => setSelectedService(null)} />}
    </section>
  )
}
