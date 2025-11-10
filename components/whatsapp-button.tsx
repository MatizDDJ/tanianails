"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/59899164731?text=¡Hola! Quiero consultar sobre los servicios de Tania Nails", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-float"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span
        className="absolute inset-0 rounded-full animate-glow"
        style={{ boxShadow: "0 0 20px rgba(37, 211, 102, 0.5)" }}
      />
    </button>
  )
}
