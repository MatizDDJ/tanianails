"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, Phone, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { obtenerTurnosDisponibles, crearReserva, actualizarTurno } from "@/lib/firebase-services"
import type { TurnoDisponible } from "@/lib/firebase-services"
import Toast from "@/components/toast"

interface BookingModalProps {
  serviceName: string
  onClose: () => void
}

export default function BookingModal({ serviceName, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    service: serviceName,
    date: "",
    time: "",
    name: "",
    phone: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [turnosDisponibles, setTurnosDisponibles] = useState<TurnoDisponible[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTurnoId, setSelectedTurnoId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (formData.date) {
      cargarTurnos()
    }
  }, [formData.date])

  const cargarTurnos = async () => {
    try {
      const turnos = await obtenerTurnosDisponibles(formData.date)
      setTurnosDisponibles(turnos)
    } catch (error) {
      console.error("[v0] Error loading turnos:", error)
      setToast({ message: "Error al cargar los horarios disponibles", type: "error" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTurnoId) {
      setToast({ message: "Por favor selecciona un horario disponible", type: "error" })
      return
    }

    setLoading(true)

    try {
      await crearReserva({
        nombre: formData.name,
        whatsapp: formData.phone,
        servicio: formData.service,
        fecha: formData.date,
        horario: formData.time,
        estado: "confirmado",
      })

      await actualizarTurno(selectedTurnoId, { disponible: false })

      setToast({ message: "¡Reserva confirmada exitosamente!", type: "success" })
      setIsSubmitted(true)
    } catch (error) {
      console.error("[v0] Error creating reservation:", error)
      setToast({ message: "Error al crear la reserva. Por favor intenta de nuevo.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsApp = () => {
    const message = `Hola Tania Nails! Confirmé una reserva:\nServicio: ${formData.service}\nFecha: ${formData.date}\nHora: ${formData.time}\nNombre: ${formData.name}\nGracias!`
    window.open(`https://wa.me/598XXXXXXXX?text=${encodeURIComponent(message)}`, "_blank")
    onClose()
  }

  const handleTimeSelect = (turno: TurnoDisponible) => {
    setFormData({ ...formData, time: turno.horario })
    setSelectedTurnoId(turno.id || null)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#111111] rounded-2xl max-w-md w-full border border-[#2a2a2a] glow-pink animate-scale-in max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2a2a] sticky top-0 bg-[#111111] z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white">{isSubmitted ? "¡Turno Reservado!" : "Reservar Turno"}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2 text-[#ff2e91]" />
                    Servicio
                  </label>
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white font-medium">
                    {formData.service}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El servicio seleccionado no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2 text-[#ff2e91]" />
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    required
                  />
                </div>

                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-2 text-[#8b2eff]" />
                      Horarios Disponibles
                    </label>
                    {turnosDisponibles.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {turnosDisponibles.map((turno) => (
                          <button
                            key={turno.id}
                            type="button"
                            onClick={() => handleTimeSelect(turno)}
                            className={`p-3 rounded-lg border transition-all transform hover:scale-105 active:scale-95 ${
                              selectedTurnoId === turno.id
                                ? "bg-[#ff2e91] border-[#ff2e91] text-white animate-pulse-glow"
                                : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#ff2e91] hover:glow-pink"
                            }`}
                          >
                            {turno.horario}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                        No hay horarios disponibles para esta fecha. Intenta con otra fecha.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2 text-[#ff2e91]" />
                    Tu Nombre Completo
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: María González"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#ff2e91] focus:ring-1 focus:ring-[#ff2e91] transition-all"
                    required
                    autoComplete="name"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">Ingresa tu nombre completo</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2 text-[#8b2eff]" />
                    Tu Número de WhatsApp
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="099 123 456 o +598 99 123 456"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#8b2eff] focus:ring-1 focus:ring-[#8b2eff] transition-all"
                    required
                    autoComplete="tel"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-500 mt-1">Ingresa tu número de WhatsApp para confirmar la reserva</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white glow-pink transform hover:scale-105 active:scale-95 transition-all py-6 text-lg"
                  disabled={loading || !selectedTurnoId}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Procesando...
                    </span>
                  ) : (
                    "Confirmar Reserva"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-[#ff2e91]/20 rounded-full flex items-center justify-center mx-auto mb-4 glow-pink animate-bounce-subtle">
                  <Check className="w-8 h-8 text-[#ff2e91]" />
                </div>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                  Tu reserva ha sido confirmada. ¿Querés continuar por WhatsApp para coordinar detalles?
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleWhatsApp} 
                    className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white transform hover:scale-105 active:scale-95 transition-all py-6"
                  >
                    Continuar por WhatsApp
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-[#2a2a2a] text-white hover:bg-[#1a1a1a] bg-transparent transform hover:scale-105 active:scale-95 transition-all py-6"
                  >
                    Entendido
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
