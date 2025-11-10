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
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-[#2a2a2a]">
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
        )}
      </nav>
    </header>
  )
}
