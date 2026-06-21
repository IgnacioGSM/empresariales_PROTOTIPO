import { api } from '../api/apiClient';
import type { Request } from '../types/requests';

export async function getRequests()
: Promise<Request[]> {

  const response =
    await api.get("/requests")

  return response.data
}

export async function getRequest(
  id: string
): Promise<Request> {

  const response =
    await api.get(
      `/requests/${id}`
    )

  return response.data
}

export async function createRequest(
  data: {
    cliente: string,
    destino: string,
    capacidadCargaNecesaria: number,
    fechaLimiteEntrega: string,
    descripcion?: string
  }
): Promise<Request> {

  const response =
    await api.post(
      "/requests",
      data
    )

  return response.data
}