"use client"

import { useState, useEffect } from "react"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-lg border-b border-[#2a2a2a]" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 text-2xl font-bold text-white group"
          >
            <Sparkles className="w-6 h-6 text-[#ff2e91] group-hover:animate-float" />
            <span className="text-glow-pink">Tania Nails</span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-white hover:text-[#ff2e91] transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-white hover:text-[#ff2e91] transition-colors"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-white hover:text-[#ff2e91] transition-colors"
            >
              Galería
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white hover:text-[#ff2e91] transition-colors"
            >
              Contacto
            </button>
            <Button
              onClick={() => scrollToSection("services")}
              className="bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white glow-pink"
            >
              Reservar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-white p-2 hover:bg-[#2a2a2a] rounded-lg transition-all active:scale-95"
            aria-label="Menu"
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'top-1/2 rotate-45' : 'top-1'
                }`}
              />
              <span 
                className={`absolute left-0 top-1/2 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
              <span 
                className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'top-1/2 -rotate-45' : 'top-5'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 py-4 border-t border-[#2a2a2a] animate-fade-in-up">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("hero")}
                className="text-white hover:text-[#ff2e91] transition-colors text-left"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-white hover:text-[#ff2e91] transition-colors text-left"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="text-white hover:text-[#ff2e91] transition-colors text-left"
              >
                Galería
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white hover:text-[#ff2e91] transition-colors text-left"
              >
                Contacto
              </button>
              <Button
                onClick={() => scrollToSection("services")}
                className="bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white glow-pink w-full"
              >
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
