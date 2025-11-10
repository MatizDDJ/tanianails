"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, Phone, Check, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { obtenerTurnosDisponibles, crearReserva, actualizarTurno, buscarCliente, obtenerOCrearCliente, actualizarHistorialCliente } from "@/lib/firebase-services"
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
    metodoPago: "efectivo" as "efectivo" | "transferencia",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [turnosDisponibles, setTurnosDisponibles] = useState<TurnoDisponible[]>([])
  const [loading, setLoading] = useState(false)
  const [buscandoCliente, setBuscandoCliente] = useState(false)
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

  // Buscar cliente cuando cambia el teléfono
  useEffect(() => {
    const buscarDatosCliente = async () => {
      if (formData.phone.length >= 8) {
        setBuscandoCliente(true)
        try {
          const cliente = await buscarCliente(formData.phone)
          if (cliente) {
            setFormData(prev => ({ ...prev, name: cliente.nombre }))
            setToast({ message: "¡Cliente encontrado! Datos autocompletados", type: "success" })
          }
        } catch (error) {
          console.error("Error buscando cliente:", error)
        } finally {
          setBuscandoCliente(false)
        }
      }
    }

    const timeout = setTimeout(buscarDatosCliente, 500)
    return () => clearTimeout(timeout)
  }, [formData.phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTurnoId) {
      setToast({ message: "Por favor selecciona un horario disponible", type: "error" })
      return
    }

    setLoading(true)

    try {
      // Obtener o crear cliente
      const cliente = await obtenerOCrearCliente(formData.name, formData.phone)

      // Crear reserva
      await crearReserva({
        nombre: formData.name,
        whatsapp: formData.phone,
        servicio: formData.service,
        fecha: formData.date,
        horario: formData.time,
        metodoPago: formData.metodoPago,
        estado: "confirmado",
      })

      // Actualizar historial del cliente
      if (cliente.id) {
        await actualizarHistorialCliente(cliente.id, formData.service)
      }

      // Marcar turno como no disponible
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
    window.open(`https://wa.me/59809164731?text=${encodeURIComponent(message)}`, "_blank")
    onClose()
  }

  const handleTimeSelect = (turno: TurnoDisponible) => {
    setFormData({ ...formData, time: turno.horario })
    setSelectedTurnoId(turno.id || null)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div className="bg-[#111111] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md sm:w-full border-t sm:border border-[#2a2a2a] glow-pink animate-scale-in max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2a2a] sticky top-0 bg-[#111111] z-10 rounded-t-3xl sm:rounded-t-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-white">{isSubmitted ? "¡Turno Reservado!" : "Reservar Turno"}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-95 p-2 hover:bg-[#2a2a2a] rounded-lg"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 pb-6 sm:pb-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-[#ff2e91]" />
                    Servicio
                  </label>
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-white font-medium text-sm sm:text-base">
                    {formData.service}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">El servicio no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-[#ff2e91]" />
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })}
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-sm sm:text-base h-11 sm:h-12"
                    required
                  />
                </div>

                {formData.date && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-[#8b2eff]" />
                      Horarios Disponibles
                    </label>
                    {turnosDisponibles.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 max-h-40 sm:max-h-48 overflow-y-auto pr-1">
                        {turnosDisponibles.map((turno) => (
                          <button
                            key={turno.id}
                            type="button"
                            onClick={() => handleTimeSelect(turno)}
                            className={`p-2.5 sm:p-3 rounded-lg border transition-all transform active:scale-95 text-sm sm:text-base font-medium ${
                              selectedTurnoId === turno.id
                                ? "bg-[#ff2e91] border-[#ff2e91] text-white shadow-lg shadow-[#ff2e91]/50"
                                : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#ff2e91]"
                            }`}
                          >
                            {turno.horario}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs sm:text-sm bg-[#1a1a1a] p-3 sm:p-4 rounded-lg border border-[#2a2a2a]">
                        No hay horarios disponibles para esta fecha. Intenta con otra fecha.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-[#ff2e91]" />
                    Nombre Completo
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: María González"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#ff2e91] focus:ring-1 focus:ring-[#ff2e91] transition-all text-sm sm:text-base h-11 sm:h-12"
                    required
                    autoComplete="name"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-[#8b2eff]" />
                    WhatsApp {buscandoCliente && <span className="text-[10px] text-gray-500 ml-2">Buscando...</span>}
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="099 123 456"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#8b2eff] focus:ring-1 focus:ring-[#8b2eff] transition-all text-sm sm:text-base h-11 sm:h-12"
                    required
                    autoComplete="tel"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2 text-[#ff2e91]" />
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, metodoPago: "efectivo" })}
                      className={`p-3 rounded-lg border transition-all text-sm sm:text-base font-medium ${
                        formData.metodoPago === "efectivo"
                          ? "bg-[#ff2e91] border-[#ff2e91] text-white shadow-lg shadow-[#ff2e91]/50"
                          : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#ff2e91]"
                      }`}
                    >
                      💵 Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, metodoPago: "transferencia" })}
                      className={`p-3 rounded-lg border transition-all text-sm sm:text-base font-medium ${
                        formData.metodoPago === "transferencia"
                          ? "bg-[#ff2e91] border-[#ff2e91] text-white shadow-lg shadow-[#ff2e91]/50"
                          : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#ff2e91]"
                      }`}
                    >
                      🏦 Transferencia
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white glow-pink active:scale-95 transition-all py-3 sm:py-4 text-base sm:text-lg font-semibold mt-2"
                  disabled={loading || !selectedTurnoId}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span className="text-sm sm:text-base">Procesando...</span>
                    </span>
                  ) : (
                    "Confirmar Reserva"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 sm:py-8 animate-fade-in">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ff2e91]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 glow-pink animate-bounce-subtle">
                  <Check className="w-7 h-7 sm:w-8 sm:h-8 text-[#ff2e91]" />
                </div>
                <h4 className="text-white font-bold text-lg sm:text-xl mb-2">¡Reserva Confirmada!</h4>
                <p className="text-gray-300 mb-5 sm:mb-6 text-xs sm:text-sm px-2">
                  ¿Querés continuar por WhatsApp para coordinar detalles?
                </p>
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  <Button 
                    onClick={handleWhatsApp} 
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white active:scale-95 transition-all py-3 sm:py-4 text-sm sm:text-base font-semibold"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Continuar por WhatsApp
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full border-[#2a2a2a] text-white hover:bg-[#1a1a1a] bg-transparent active:scale-95 transition-all py-3 sm:py-4 text-sm sm:text-base"
                  >
                    Cerrar
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
