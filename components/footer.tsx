"use client"

import { Sparkles, Instagram } from "lucide-react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Footer() {
  const [clickCount, setClickCount] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogoClick = () => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount === 5) {
      // Easter egg activado!
      router.push("/admin")
      setClickCount(0)
    } else {
      // Reset counter after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setClickCount(0)
      }, 2000)
    }
  }

  return (
    <footer className="bg-black border-t border-[#2a2a2a] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div>
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 mb-4 group cursor-pointer transition-all hover:scale-105"
            >
              <Sparkles className={`w-6 h-6 text-[#ff2e91] transition-all ${clickCount > 0 ? 'animate-bounce-subtle' : ''}`} />
              <span className={`text-2xl font-bold text-white text-glow-pink transition-all ${clickCount >= 3 ? 'animate-pulse-glow' : ''}`}>
                Tania Nails
              </span>
            </button>
            <p className="text-gray-400 text-sm">
              Uñas con actitud, estilo que marca tendencia. Tu salón de nail art premium en Uruguay.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-gray-400 hover:text-[#ff2e91] transition-colors text-left text-sm"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-400 hover:text-[#ff2e91] transition-colors text-left text-sm"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="text-gray-400 hover:text-[#ff2e91] transition-colors text-left text-sm"
              >
                Galería
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-400 hover:text-[#ff2e91] transition-colors text-left text-sm"
              >
                Contacto
              </button>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Seguinos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/tania_nails.bfb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#ff2e91]/20 rounded-full flex items-center justify-center hover:bg-[#ff2e91]/30 transition-colors glow-pink"
              >
                <Instagram className="w-5 h-5 text-[#ff2e91]" />
              </a>
              <a
                href="https://wa.me/59899164731"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#25D366]/20 rounded-full flex items-center justify-center hover:bg-[#25D366]/30 transition-colors"
              >
                <Image 
                  src="/whatsapp-icon.svg" 
                  alt="WhatsApp" 
                  width={20} 
                  height={20}
                  className="w-5 h-5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#2a2a2a] pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Tania Nails. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
