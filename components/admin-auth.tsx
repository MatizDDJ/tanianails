"use client"

import { useState, useEffect } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Contraseña por defecto - CÁMBIALA en producción
  const ADMIN_PASSWORD = "TaniaNails2024"

  useEffect(() => {
    // Verificar si ya está autenticado en sessionStorage
    const auth = sessionStorage.getItem("admin_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_authenticated", "true")
      setError("")
    } else {
      setError("Contraseña incorrecta")
      setPassword("")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff2e91]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 max-w-md w-full glow-pink animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ff2e91]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#ff2e91]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel Admin</h1>
            <p className="text-gray-400">Ingresá tu contraseña para acceder</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-lg py-6"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in-up">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white py-6 text-lg glow-pink"
            >
              Ingresar
            </Button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-6">
            Contraseña por defecto: <code className="bg-[#1a1a1a] px-2 py-1 rounded">TaniaNails2024</code>
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
