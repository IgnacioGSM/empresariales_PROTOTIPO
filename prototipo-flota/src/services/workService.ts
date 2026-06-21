import { api } from "../api/apiClient"

export interface WorkSummary {
  id: string

  estadoOperativo: string

  resultado?: string | null

  cargaTotal: number

  cargaEntregada: number

  assignmentCount: number

  totalAssignedLoad: number

  remainingLoad: number

  solicitud: {
    cliente: string
    destino: string
    fechaLimite: string
  }
}

export async function getActiveWorks() {
  const response =
    await api.get(
      "/works/active"
    )

  return response.data
}