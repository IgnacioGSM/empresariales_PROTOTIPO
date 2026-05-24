import solicitudes from "../seed/solicitudes.json"
import trabajos from "../seed/trabajos.json"
import vehiculos from "../seed/vehiculos.json"
import conductores from "../seed/conductores.json"
import asignaciones from "../seed/asignaciones.json"
import rutas from "../seed/rutas.json"
import incidencias from "../seed/incidencias.json"
import sucursales from "../seed/sucursales.json"

export const STORAGE_KEYS = {
  SOLICITUDES: "solicitudes",
  TRABAJOS: "trabajos",
  VEHICULOS: "vehiculos",
  CONDUCTORES: "conductores",
  ASIGNACIONES: "asignaciones",
  RUTAS: "rutas",
  INCIDENCIAS: "incidencias",
  SUCURSALES: "sucursales"
} as const

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]


function initializeCollection<T> (key:  StorageKey, data: T): void {
  const existing = localStorage.getItem(key)

  if (!existing) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function initializeStorage(): void {

  initializeCollection(STORAGE_KEYS.SOLICITUDES, solicitudes)
  initializeCollection(STORAGE_KEYS.TRABAJOS, trabajos)
  initializeCollection(STORAGE_KEYS.VEHICULOS, vehiculos)
  initializeCollection(STORAGE_KEYS.CONDUCTORES, conductores)
  initializeCollection(STORAGE_KEYS.ASIGNACIONES, asignaciones)
  initializeCollection(STORAGE_KEYS.RUTAS, rutas)
  initializeCollection(STORAGE_KEYS.INCIDENCIAS, incidencias)
  initializeCollection(STORAGE_KEYS.SUCURSALES, sucursales)
}

export function resetStorage(): void {
  localStorage.clear()
  initializeStorage()
}