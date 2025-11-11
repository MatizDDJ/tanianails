"use client"

import Image from "next/image"

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/59891647312?text=¡Hola! Quiero consultar sobre los servicios de Tania Nails", "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-float"
      aria-label="Contactar por WhatsApp"
    >
      <Image 
        src="/whatsapp-icon.svg" 
        alt="WhatsApp" 
        width={32} 
        height={32}
        className="w-8 h-8"
      />
      <span
        className="absolute inset-0 rounded-full animate-glow"
        style={{ boxShadow: "0 0 20px rgba(37, 211, 102, 0.5)" }}
      />
    </button>
  )
}
