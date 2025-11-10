"use client"

import { MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const scrollToServices = () => {
    const element = document.getElementById("services")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openWhatsApp = () => {
    window.open("https://wa.me/598XXXXXXXX?text=¡Hola! Quiero reservar un turno en Tania Nails", "_blank")
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8b2eff]/20 via-black to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff2e91]/30 rounded-full blur-[120px] animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b2eff]/30 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up text-balance leading-tight">
            <span className="text-glow-pink">Uñas con actitud,</span>
            <br />
            <span className="text-[#8b2eff] text-glow-purple">estilo que marca tendencia</span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up max-w-2xl mx-auto px-4"
            style={{ animationDelay: "0.2s" }}
          >
            Transformá tu look con el mejor nail art de Uruguay. Técnicas premium, diseños únicos y la experiencia que
            merecés.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up px-4"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              onClick={scrollToServices}
              size="lg"
              className="bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white glow-pink text-base sm:text-lg px-6 sm:px-8 py-6 group transform hover:scale-105 active:scale-95 transition-all"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
              Reservar Turno
            </Button>
            <Button
              onClick={openWhatsApp}
              size="lg"
              variant="outline"
              className="border-2 border-[#8b2eff] text-white hover:bg-[#8b2eff]/20 glow-purple text-base sm:text-lg px-6 sm:px-8 py-6 group bg-transparent transform hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
