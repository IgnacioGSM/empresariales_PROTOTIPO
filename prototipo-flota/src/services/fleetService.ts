import { api } from "../api/apiClient"

interface Vehicle {
    id: string
    patente: string
    capacidad: number
    estado: string
}

interface Driver {
    id: string
    nombre: string
    estado: string
}

export interface FleetResources {
  vehicles: Vehicle[]
  drivers: Driver[]
}

export async function getResources() {
  const response =
    await api.get(
      "/fleet/resources"
    )

  return response.data
}