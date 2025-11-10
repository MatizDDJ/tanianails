// Firebase service functions for turnos and reservas
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"

export interface TurnoDisponible {
  id?: string
  fecha: string
  horario: string
  disponible: boolean
}

export interface Reserva {
  id?: string
  nombre: string
  whatsapp: string
  servicio: string
  fecha: string
  horario: string
  metodoPago?: "efectivo" | "transferencia"
  timestamp: Timestamp
  estado: "confirmado" | "pendiente" | "cancelado"
}

export interface ImagenGaleria {
  id?: string
  url: string
  alt: string
  categoria: string
  orden: number
  timestamp: Timestamp
}

// Turnos Disponibles
export const crearTurno = async (turno: Omit<TurnoDisponible, "id">) => {
  const docRef = await addDoc(collection(db, "turnos_disponibles"), turno)
  return docRef.id
}

export const actualizarTurno = async (id: string, data: Partial<TurnoDisponible>) => {
  const turnoRef = doc(db, "turnos_disponibles", id)
  await updateDoc(turnoRef, data)
}

export const eliminarTurno = async (id: string) => {
  const turnoRef = doc(db, "turnos_disponibles", id)
  await deleteDoc(turnoRef)
}

export const obtenerTurnosDisponibles = async (fecha?: string) => {
  let q = query(collection(db, "turnos_disponibles"), where("disponible", "==", true))

  if (fecha) {
    q = query(q, where("fecha", "==", fecha))
  }

  q = query(q, orderBy("horario"))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TurnoDisponible)
}

export const obtenerTodosTurnos = async () => {
  const q = query(collection(db, "turnos_disponibles"), orderBy("fecha"), orderBy("horario"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TurnoDisponible)
}

// Reservas
export const crearReserva = async (reserva: Omit<Reserva, "id" | "timestamp">) => {
  const reservaData = {
    ...reserva,
    timestamp: Timestamp.now(),
  }
  const docRef = await addDoc(collection(db, "reservas"), reservaData)
  return docRef.id
}

export const actualizarReserva = async (id: string, data: Partial<Reserva>) => {
  const reservaRef = doc(db, "reservas", id)
  await updateDoc(reservaRef, data)
}

export const obtenerReservas = async () => {
  const q = query(collection(db, "reservas"), orderBy("timestamp", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Reserva)
}

// Real-time listeners
export const escucharTurnos = (callback: (turnos: TurnoDisponible[]) => void) => {
  const q = query(collection(db, "turnos_disponibles"), orderBy("fecha"), orderBy("horario"))
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const turnos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TurnoDisponible)
    callback(turnos)
  })
}

export const escucharReservas = (callback: (reservas: Reserva[]) => void) => {
  const q = query(collection(db, "reservas"), orderBy("timestamp", "desc"))
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const reservas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Reserva)
    callback(reservas)
  })
}

// Imágenes de Galería
export const crearImagenGaleria = async (imagen: Omit<ImagenGaleria, "id" | "timestamp">) => {
  const imagenData = {
    ...imagen,
    timestamp: Timestamp.now(),
  }
  const docRef = await addDoc(collection(db, "galeria"), imagenData)
  return docRef.id
}

export const actualizarImagenGaleria = async (id: string, data: Partial<ImagenGaleria>) => {
  const imagenRef = doc(db, "galeria", id)
  await updateDoc(imagenRef, data)
}

export const eliminarImagenGaleria = async (id: string) => {
  const imagenRef = doc(db, "galeria", id)
  await deleteDoc(imagenRef)
}

export const obtenerImagenesGaleria = async (categoria?: string) => {
  let q = query(collection(db, "galeria"), orderBy("orden", "asc"))
  
  if (categoria && categoria !== "todos") {
    q = query(collection(db, "galeria"), where("categoria", "==", categoria), orderBy("orden", "asc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ImagenGaleria)
}

export const escucharImagenesGaleria = (callback: (imagenes: ImagenGaleria[]) => void, categoria?: string) => {
  let q = query(collection(db, "galeria"), orderBy("orden", "asc"))
  
  if (categoria && categoria !== "todos") {
    q = query(collection(db, "galeria"), where("categoria", "==", categoria), orderBy("orden", "asc"))
  }

  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const imagenes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ImagenGaleria)
    callback(imagenes)
  })
}

// Historial de Clientes
export interface ClienteHistorial {
  id?: string
  nombre: string
  whatsapp: string
  email?: string
  ultimaVisita: Timestamp
  totalReservas: number
  serviciosFrecuentes: string[]
}

export const obtenerOCrearCliente = async (nombre: string, whatsapp: string) => {
  const q = query(collection(db, "clientes"), where("whatsapp", "==", whatsapp))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    // Crear nuevo cliente
    const clienteData: Omit<ClienteHistorial, "id"> = {
      nombre,
      whatsapp,
      ultimaVisita: Timestamp.now(),
      totalReservas: 1,
      serviciosFrecuentes: [],
    }
    const docRef = await addDoc(collection(db, "clientes"), clienteData)
    return { id: docRef.id, ...clienteData }
  } else {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ClienteHistorial
  }
}

export const actualizarHistorialCliente = async (id: string, servicio: string) => {
  const clienteRef = doc(db, "clientes", id)
  const clienteDoc = await getDocs(query(collection(db, "clientes"), where("__name__", "==", id)))
  
  if (!clienteDoc.empty) {
    const cliente = clienteDoc.docs[0].data() as ClienteHistorial
    const serviciosFrecuentes = cliente.serviciosFrecuentes || []
    
    if (!serviciosFrecuentes.includes(servicio)) {
      serviciosFrecuentes.push(servicio)
    }
    
    await updateDoc(clienteRef, {
      ultimaVisita: Timestamp.now(),
      totalReservas: (cliente.totalReservas || 0) + 1,
      serviciosFrecuentes,
    })
  }
}

export const buscarCliente = async (whatsapp: string): Promise<ClienteHistorial | null> => {
  const q = query(collection(db, "clientes"), where("whatsapp", "==", whatsapp))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) return null
  
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ClienteHistorial
}
