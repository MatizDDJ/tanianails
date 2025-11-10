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
      <div className="min-h-screen bg-black py-6 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-sm sm:text-base text-gray-400">Gestiona tus turnos y reservas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-[#2a2a2a] overflow-x-auto">
          <button
            onClick={() => setActiveTab("turnos")}
            className={`pb-3 sm:pb-4 px-2 sm:px-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              activeTab === "turnos" ? "text-[#ff2e91] border-b-2 border-[#ff2e91]" : "text-gray-400 hover:text-white"
            }`}
          >
            Turnos Disponibles
          </button>
          <button
            onClick={() => setActiveTab("reservas")}
            className={`pb-3 sm:pb-4 px-2 sm:px-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
              activeTab === "reservas" ? "text-[#ff2e91] border-b-2 border-[#ff2e91]" : "text-gray-400 hover:text-white"
            }`}
          >
            Reservas ({reservas.length})
          </button>
        </div>

        {/* Turnos Tab */}
        {activeTab === "turnos" && (
          <div className="space-y-6">
            {/* Create Turno Form */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 sm:p-6 animate-fade-in-up">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff2e91]" />
                Crear Nuevo Turno (Para Todos los Servicios)
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Los turnos que crees estarán disponibles para cualquier servicio. Cuando alguien reserve, el turno se marcará como ocupado.
              </p>
              <form onSubmit={handleCrearTurno} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha</label>
                  <Input
                    type="date"
                    value={nuevoTurno.fecha}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Horario</label>
                  <Input
                    type="time"
                    value={nuevoTurno.horario}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, horario: e.target.value })}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    required
                  />
                </div>
                <div className="flex items-end lg:col-span-1">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#ff2e91] hover:bg-[#ff2e91]/90 text-white transform hover:scale-105 active:scale-95 transition-all"
                  >
                    Crear Turno
                  </Button>
                </div>
              </form>
            </div>

            {/* Turnos List */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 sm:p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Turnos ({turnos.length})</h2>
              <div className="space-y-3">
                {turnos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay turnos creados</p>
                ) : (
                  turnos.map((turno) => (
                    <div
                      key={turno.id}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#ff2e91] transition-all"
                    >
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1 text-white font-medium text-base sm:text-lg">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                            {turno.fecha}
                          </span>
                          <span className="flex items-center gap-1 text-white font-medium text-base sm:text-lg">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                            {turno.horario}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Disponible para todos los servicios</p>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleToggleDisponibilidad(turno.id!, turno.disponible)}
                          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all transform hover:scale-105 active:scale-95 ${
                            turno.disponible
                              ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                          }`}
                        >
                          {turno.disponible ? "Disponible" : "No disponible"}
                        </button>
                        <button
                          onClick={() => handleEliminarTurno(turno.id!)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-500 transform hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 sm:p-6 animate-fade-in-up">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Reservas Recibidas</h2>
            <div className="space-y-3">
              {reservas.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay reservas</p>
              ) : (
                reservas.map((reserva) => (
                  <div key={reserva.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#ff2e91] transition-all">
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-base sm:text-lg">{reserva.nombre}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">WhatsApp: {reserva.whatsapp}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500">Servicio:</span>
                        <p className="text-white font-medium">{reserva.servicio}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Fecha:</span>
                        <p className="text-white font-medium">{reserva.fecha}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Hora:</span>
                        <p className="text-white font-medium">{reserva.horario}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Reservado:</span>
                        <p className="text-white font-medium">{reserva.timestamp?.toDate().toLocaleDateString("es-UY")}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {reserva.estado !== "confirmado" && (
                        <Button
                          onClick={() => handleCambiarEstadoReserva(reserva.id!, "confirmado")}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm transform hover:scale-105 active:scale-95 transition-all"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Confirmar
                        </Button>
                      )}
                      {reserva.estado !== "cancelado" && (
                        <Button
                          onClick={() => handleCambiarEstadoReserva(reserva.id!, "cancelado")}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-500/20 text-xs sm:text-sm transform hover:scale-105 active:scale-95 transition-all"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
