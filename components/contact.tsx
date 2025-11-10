"use client"

import { MapPin, Clock, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-black to-[#111111]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow-purple">Contacto</h2>
          <p className="text-gray-400 text-lg">Encontranos y reservá tu próximo turno</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#ff2e91] transition-all duration-300 hover:glow-pink text-center">
            <div className="w-12 h-12 bg-[#ff2e91]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-[#ff2e91]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Ubicación</h3>
            <p className="text-gray-400 text-sm">
              Montevideo, Uruguay
              <br />
              (Dirección específica)
            </p>
          </div>

          <div className="bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#8b2eff] transition-all duration-300 hover:glow-purple text-center">
            <div className="w-12 h-12 bg-[#8b2eff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-[#8b2eff]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Horarios</h3>
            <p className="text-gray-400 text-sm">
              Lun a Vie: 10:00 - 20:00
              <br />
              Sábados: 10:00 - 18:00
            </p>
          </div>

          <div className="bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#ff2e91] transition-all duration-300 hover:glow-pink text-center">
            <div className="w-12 h-12 bg-[#ff2e91]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="w-6 h-6 text-[#ff2e91]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Instagram</h3>
            <Button
              onClick={() => window.open("https://www.instagram.com/tania_nails.bfb/", "_blank")}
              variant="link"
              className="text-[#ff2e91] hover:text-[#ff2e91]/80 p-0"
            >
              @tania_nails.bfb
            </Button>
          </div>

          <div className="bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#25D366] transition-all duration-300 text-center">
            <div className="w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
            <Button
              onClick={() => window.open("https://wa.me/59809164731", "_blank")}
              variant="link"
              className="text-[#25D366] hover:text-[#25D366]/80 p-0"
            >
              +598 XX XXX XXX
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
