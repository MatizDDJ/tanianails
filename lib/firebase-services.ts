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
  timestamp: Timestamp
  estado: "confirmado" | "pendiente" | "cancelado"
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
