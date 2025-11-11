"use client"

import { useState, useEffect } from "react"
import { Search, Phone, Calendar, TrendingUp, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { ClienteHistorial } from "@/lib/firebase-services"
import { Skeleton } from "@/components/ui/skeleton"

export default function GestionClientes() {
  const [clientes, setClientes] = useState<ClienteHistorial[]>([])
  const [filteredClientes, setFilteredClientes] = useState<ClienteHistorial[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarClientes()
  }, [])

  useEffect(() => {
    const filtered = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.whatsapp.includes(searchTerm)
    )
    setFilteredClientes(filtered)
  }, [searchTerm, clientes])

  const cargarClientes = async () => {
    try {
      const q = query(collection(db, "clientes"), orderBy("ultimaVisita", "desc"))
      const snapshot = await getDocs(q)
      const clientesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClienteHistorial[]
      setClientes(clientesData)
      setFilteredClientes(clientesData)
    } catch (error) {
      console.error("Error cargando clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate()
    return date.toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-[#111111] rounded-2xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Gestión de Clientes</h2>
        <div className="text-sm text-gray-400">
          {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
          />
        </div>
      </div>

      {/* Lista de clientes */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredClientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] hover:border-[#ff2e91] transition-all animate-slide-up"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#ff2e91]" />
                    {cliente.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Phone className="w-4 h-4" />
                    {cliente.whatsapp}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#ff2e91]/20 text-[#ff2e91] px-3 py-1 rounded-full text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  {cliente.totalReservas || 0} visitas
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-[#111111] rounded-lg p-3 border border-[#2a2a2a]">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Última visita</span>
                  </div>
                  <div className="text-white font-medium">
                    {formatearFecha(cliente.ultimaVisita)}
                  </div>
                </div>

                <div className="bg-[#111111] rounded-lg p-3 border border-[#2a2a2a]">
                  <div className="text-gray-400 mb-1">Servicios frecuentes</div>
                  <div className="text-white font-medium">
                    {cliente.serviciosFrecuentes && cliente.serviciosFrecuentes.length > 0 
                      ? cliente.serviciosFrecuentes.join(", ")
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => window.open(`https://wa.me/598${cliente.whatsapp}`, '_blank')}
                  className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-sm py-2 rounded-lg transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contactar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
