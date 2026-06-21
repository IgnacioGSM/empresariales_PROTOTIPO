import { api }  from "../api/apiClient"

export interface Assignment {
  id: string
  trabajoId: string
  vehiculoId: string
  conductorId: string
  cargaAsignada: number
  rutaPlanificada?: string | null
}

export async function createAssignment({
  trabajoId,
  vehiculoId,
  conductorId,
  cargaAsignada,
  rutaPlanificada
}: {
  trabajoId: string
  vehiculoId: string
  conductorId: string
  cargaAsignada: number
  rutaPlanificada?: string
}) {
  const response =
    await api.post(
      "/assignments",
      {
        trabajoId,
        vehiculoId,
        conductorId,
        cargaAsignada,
        rutaPlanificada
      }
    )

  return response.data
}