"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { escucharReservas, escucharTurnos, type Reserva, type TurnoDisponible } from "@/lib/firebase-services"

export default function CalendarioAdmin() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [turnos, setTurnos] = useState<TurnoDisponible[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const unsubReservas = escucharReservas((data) => setReservas(data))
    const unsubTurnos = escucharTurnos((data) => setTurnos(data))

    return () => {
      unsubReservas()
      unsubTurnos()
    }
  }, [])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getReservasForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return reservas.filter(r => r.fecha === dateStr)
  }

  const getTurnosForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return turnos.filter(t => t.fecha === dateStr && t.disponible)
  }

  const renderDay = (day: number) => {
    const reservasDelDia = getReservasForDate(day)
    const turnosDelDia = getTurnosForDate(day)
    const isToday = new Date().getDate() === day && 
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear()

    return (
      <div
        key={day}
        onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        className={`min-h-24 p-2 border border-[#2a2a2a] rounded-lg cursor-pointer transition-all hover:border-[#ff2e91] hover:bg-[#1a1a1a] ${
          isToday ? 'bg-[#8b2eff]/10 border-[#8b2eff]' : 'bg-[#111111]'
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-semibold ${isToday ? 'text-[#8b2eff]' : 'text-white'}`}>
            {day}
          </span>
          {reservasDelDia.length > 0 && (
            <span className="text-xs bg-[#ff2e91] text-white px-1.5 py-0.5 rounded-full">
              {reservasDelDia.length}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          {reservasDelDia.slice(0, 2).map((reserva, idx) => (
            <div key={idx} className="text-xs bg-[#ff2e91]/20 border border-[#ff2e91]/50 rounded p-1 truncate">
              <Clock className="w-3 h-3 inline mr-1" />
              {reserva.horario}
            </div>
          ))}
          {reservasDelDia.length > 2 && (
            <div className="text-xs text-gray-400">+{reservasDelDia.length - 2} más</div>
          )}
          {turnosDelDia.length > 0 && reservasDelDia.length === 0 && (
            <div className="text-xs text-gray-500">
              {turnosDelDia.length} disponibles
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={prevMonth}
            variant="outline"
            size="sm"
            className="border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={nextMonth}
            variant="outline"
            size="sm"
            className="border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="min-h-24" />
        ))}
        {[...Array(daysInMonth)].map((_, i) => renderDay(i + 1))}
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4">
            Detalles del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
          </h3>
          
          {getReservasForDate(selectedDate.getDate()).length > 0 ? (
            <div className="space-y-3">
              {getReservasForDate(selectedDate.getDate()).map((reserva, idx) => (
                <div key={idx} className="bg-[#111111] p-3 rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <User className="w-4 h-4 text-[#ff2e91]" />
                        {reserva.nombre}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Clock className="w-3 h-3" />
                        {reserva.horario}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reserva.estado === 'confirmado' ? 'bg-green-500/20 text-green-400' :
                      reserva.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {reserva.estado}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    <strong>Servicio:</strong> {reserva.servicio}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>WhatsApp:</strong> {reserva.whatsapp}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No hay reservas para este día</p>
          )}

          <Button
            onClick={() => setSelectedDate(null)}
            variant="outline"
            className="w-full mt-4 border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a]"
          >
            Cerrar
          </Button>
        </div>
      )}
    </div>
  )
}
