"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

export default function Loader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center animate-fade-in-up">
        <div className="relative inline-block">
          <Sparkles className="w-20 h-20 text-[#ff2e91] animate-float" />
          <div className="absolute inset-0 animate-glow rounded-full" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-white text-glow-pink">Tania Nails</h2>
        <p className="mt-2 text-sm text-[#8b2eff]">Cargando experiencia premium...</p>
      </div>
    </div>
  )
}
