"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  crearTurno,
  actualizarTurno,
  eliminarTurno,
  actualizarReserva,
  escucharTurnos,
  escucharReservas,
  type TurnoDisponible,
  type Reserva,
} from "@/lib/firebase-services"
import Toast from "@/components/toast"
import AdminAuth from "@/components/admin-auth"

const serviciosDisponibles = [
  "Soft Gel",
  "Polygel",
  "Esculpidas",
  "Capping Gel",
  "Esmaltado Semipermanente",
  "Kapping",
  "Nail Art",
  "Pedicuría",
]

export default function AdminPanel() {
  const [turnos, setTurnos] = useState<TurnoDisponible[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [activeTab, setActiveTab] = useState<"turnos" | "reservas">("turnos")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [generandoTurnos, setGenerandoTurnos] = useState(false)

  // Form state for creating new turno
  const [nuevoTurno, setNuevoTurno] = useState({
    fecha: "",
    horario: "",
  })

  // Listen to real-time updates
  useEffect(() => {
    const unsubscribeTurnos = escucharTurnos((turnosActualizados) => {
      setTurnos(turnosActualizados)
    })

    const unsubscribeReservas = escucharReservas((reservasActualizadas) => {
      setReservas(reservasActualizadas)
    })

    return () => {
      unsubscribeTurnos()
      unsubscribeReservas()
    }
  }, [])

  const handleCrearTurno = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await crearTurno({
        fecha: nuevoTurno.fecha,
        horario: nuevoTurno.horario,
        disponible: true,
      })

      setNuevoTurno({
        fecha: "",
        horario: "",
      })

      setToast({ message: "Turno creado exitosamente", type: "success" })
    } catch (error) {
      console.error("[v0] Error creating turno:", error)
      setToast({ message: "Error al crear el turno", type: "error" })
    }
  }

  const handleGenerarTurnosAutomaticos = async () => {
    if (!nuevoTurno.fecha) {
      setToast({ message: "Selecciona primero una fecha", type: "error" })
      return
    }

    setGenerandoTurnos(true)

    try {
      // Generar turnos de 10:00 a 20:00 con intervalos de 1:30
      const horarios = []
      let hora = 10
      let minutos = 0

      while (hora < 20 || (hora === 20 && minutos === 0)) {
        const horarioStr = `${hora.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`
        horarios.push(horarioStr)

        // Sumar 1:30
        minutos += 30
        if (minutos >= 60) {
          hora += 1
          minutos -= 60
        }
        hora += 1
      }

      // Crear todos los turnos
      const promises = horarios.map((horario) =>
        crearTurno({
          fecha: nuevoTurno.fecha,
          horario,
          disponible: true,
        })
      )

      await Promise.all(promises)

      setToast({
        message: `✅ ${horarios.length} turnos generados exitosamente desde 10:00 hasta 20:00`,
        type: "success",
      })
    } catch (error) {
      console.error("[v0] Error generating turnos:", error)
      setToast({ message: "Error al generar los turnos automáticos", type: "error" })
    } finally {
      setGenerandoTurnos(false)
    }
  }

  const handleToggleDisponibilidad = async (id: string, disponible: boolean) => {
    try {
      await actualizarTurno(id, { disponible: !disponible })
      setToast({
        message: !disponible ? "Turno marcado como disponible" : "Turno marcado como no disponible",
        type: "success",
      })
    } catch (error) {
      console.error("[v0] Error updating turno:", error)
      setToast({ message: "Error al actualizar el turno", type: "error" })
    }
  }

  const handleEliminarTurno = async (id: string) => {
    if (!confirm("¿Estás segura de eliminar este turno?")) return

    try {
      await eliminarTurno(id)
      setToast({ message: "Turno eliminado exitosamente", type: "success" })
    } catch (error) {
      console.error("[v0] Error deleting turno:", error)
      setToast({ message: "Error al eliminar el turno", type: "error" })
    }
  }

  const handleCambiarEstadoReserva = async (id: string, estado: "confirmado" | "cancelado") => {
    try {
      await actualizarReserva(id, { estado })
      setToast({ message: `Reserva marcada como ${estado}`, type: "success" })
    } catch (error) {
      console.error("[v0] Error updating reserva:", error)
      setToast({ message: "Error al actualizar la reserva", type: "error" })
    }
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-black py-4 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">Panel de Administración</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">Gestiona tus turnos y reservas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-[#2a2a2a] overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("turnos")}
            className={`pb-2 sm:pb-3 px-3 sm:px-4 font-medium transition-all whitespace-nowrap text-xs sm:text-sm md:text-base ${
              activeTab === "turnos" ? "text-[#ff2e91] border-b-2 border-[#ff2e91]" : "text-gray-400 hover:text-white"
            }`}
          >
            Turnos
          </button>
          <button
            onClick={() => setActiveTab("reservas")}
            className={`pb-2 sm:pb-3 px-3 sm:px-4 font-medium transition-all whitespace-nowrap text-xs sm:text-sm md:text-base ${
              activeTab === "reservas" ? "text-[#ff2e91] border-b-2 border-[#ff2e91]" : "text-gray-400 hover:text-white"
            }`}
          >
            Reservas ({reservas.length})
          </button>
        </div>

        {/* Turnos Tab */}
        {activeTab === "turnos" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Create Turno Form */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 animate-fade-in-up">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2e91]" />
                <span className="text-sm sm:text-base md:text-lg">Crear Turno</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                Para todos los servicios. Se marcará como ocupado al reservar.
              </p>
              
              {/* Botón de generación automática */}
              <div className="mb-4 p-3 sm:p-4 bg-[#8b2eff]/10 border border-[#8b2eff]/30 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm sm:text-base mb-1">⚡ Generación Automática</h3>
                    <p className="text-xs text-gray-400">
                      Crea turnos de 10:00 a 20:00 con intervalos de 1:30hs (ejemplo: 10:00, 11:30, 13:00...)
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGenerarTurnosAutomaticos}
                    disabled={!nuevoTurno.fecha || generandoTurnos}
                    className="bg-[#8b2eff] hover:bg-[#8b2eff]/90 text-white glow-purple text-xs sm:text-sm px-4 py-2 w-full sm:w-auto"
                  >
                    {generandoTurnos ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Generando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Generar Turnos
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleCrearTurno} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Fecha</label>
                  <Input
                    type="date"
                    value={nuevoTurno.fecha}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-sm h-10 sm:h-11"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Horario</label>
                  <Input
                    type="time"
                    value={nuevoTurno.horario}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, horario: e.target.value })}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-sm h-10 sm:h-11"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white active:scale-95 transition-all text-sm sm:text-base py-2.5 sm:py-3"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Crear Turno
                  </Button>
                </div>
              </form>
            </div>

            {/* Turnos List */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Turnos ({turnos.length})</h2>
              <div className="space-y-3">
                {turnos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay turnos creados</p>
                ) : (
                  turnos.map((turno) => (
                    <div
                      key={turno.id}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 hover:border-[#ff2e91] transition-all"
                    >
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1 text-white font-medium text-sm sm:text-base">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {turno.fecha}
                          </span>
                          <span className="flex items-center gap-1 text-white font-medium text-sm sm:text-base">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {turno.horario}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Para todos los servicios</p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleToggleDisponibilidad(turno.id!, turno.disponible)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all active:scale-95 ${
                            turno.disponible
                              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                          }`}
                        >
                          {turno.disponible ? "Disponible" : "No disp."}
                        </button>
                        <button
                          onClick={() => handleEliminarTurno(turno.id!)}
                          className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-500 active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reservas Tab */}
        {activeTab === "reservas" && (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 animate-fade-in-up">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">Reservas Recibidas</h2>
            <div className="space-y-3">
              {reservas.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay reservas</p>
              ) : (
                reservas.map((reserva) => (
                  <div key={reserva.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 sm:p-4 hover:border-[#ff2e91] transition-all">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-2 sm:mb-3 gap-1.5 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm sm:text-base truncate">{reserva.nombre}</h3>
                        <p className="text-gray-400 text-[10px] sm:text-xs">WhatsApp: {reserva.whatsapp}</p>
                      </div>
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                          reserva.estado === "confirmado"
                            ? "bg-green-500/20 text-green-500"
                            : reserva.estado === "cancelado"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {reserva.estado}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3 text-[10px] sm:text-xs">
                      <div>
                        <span className="text-gray-500 block mb-0.5">Servicio:</span>
                        <p className="text-white font-medium text-xs sm:text-sm">{reserva.servicio}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Fecha:</span>
                        <p className="text-white font-medium text-xs sm:text-sm">{reserva.fecha}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Hora:</span>
                        <p className="text-white font-medium text-xs sm:text-sm">{reserva.horario}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Reservado:</span>
                        <p className="text-white font-medium text-xs sm:text-sm">{reserva.timestamp?.toDate().toLocaleDateString("es-UY")}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                      {reserva.estado !== "confirmado" && (
                        <Button
                          onClick={() => handleCambiarEstadoReserva(reserva.id!, "confirmado")}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm active:scale-95 transition-all py-2 sm:py-2.5"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                          Confirmar
                        </Button>
                      )}
                      {reserva.estado !== "cancelado" && (
                        <Button
                          onClick={() => handleCambiarEstadoReserva(reserva.id!, "cancelado")}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-500/20 text-xs sm:text-sm active:scale-95 transition-all py-2 sm:py-2.5"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </AdminAuth>
  )
}
