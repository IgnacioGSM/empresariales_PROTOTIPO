import { STORAGE_KEYS } from "../storage/initializeStorage"
import type { Request } from "../../types/requests"

type CreateRequestDTO = {
    cliente: string
    destino: string
    cargaRequerida: number
    fechaLimite: string
}

type Work = {
  id: string
  solicitudId: string
  cliente: string
  destino: string
  cargaTotalRequerida: number
  cargaEntregada: number
  fechaLimite: string
  estado: string
  asignacionesIds: string[]
}

function getRequestsFromStorage(): Request[] {
    const data = localStorage.getItem(STORAGE_KEYS.SOLICITUDES)
    return data ? JSON.parse(data) : []
}

function getWorksFromStorage(): Work[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRABAJOS)
    return data ? JSON.parse(data) : []
}

function saveRequests(requests: Request[]): void {
    localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(requests))
}

function saveWorks(works: Work[]): void {
    localStorage.setItem(STORAGE_KEYS.TRABAJOS, JSON.stringify(works))
}

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}`
}

export function getAllRequests(): Request[] {
    return getRequestsFromStorage()
}

export function getRequestById(id: string): Request | undefined {
    const requests = getRequestsFromStorage()
    return requests.find(req => req.id === id)
}

export function createRequest(data: CreateRequestDTO): Request {
    const requests = getRequestsFromStorage()
    const newRequest: Request = {
        id: generateId("sol"),
        cliente: data.cliente,
        destino: data.destino,
        cargaRequerida: data.cargaRequerida,
        fechaLimite: data.fechaLimite,
        estado: "pendiente",
        trabajoId: null
    }
    requests.push(newRequest)
    saveRequests(requests)
    return newRequest
}

export function approveRequest(id: string): Work {

    const requests = getRequestsFromStorage()
    const works = getWorksFromStorage()

    const request = requests.find(req => req.id === id)

    if (!request) {
        throw new Error("Solicitud no encontrada")
    }

    if (request.estado !== "pendiente") {
        throw new Error("Solo se pueden aprobar solicitudes pendientes")
    }

    request.estado = "aprobada"

    const newWork: Work = {
        id: generateId("trab"),
        solicitudId: request.id,
        cliente: request.cliente,
        destino: request.destino,
        cargaTotalRequerida: request.cargaRequerida,
        cargaEntregada: 0,
        fechaLimite: request.fechaLimite,
        estado: "pendiente",
        asignacionesIds: []
    }

    request.trabajoId = newWork.id
    saveRequests(requests)
    works.push(newWork)
    saveWorks(works)
    return newWork
}

export function rejectRequest(id: string): void {
    const requests = getRequestsFromStorage()

    const request = requests.find(req => req.id === id)

    if (!request) {
        throw new Error("Solicitud no encontrada")
    }

    if (request.estado !== "pendiente") {
            throw new Error("Solo se pueden rechazar solicitudes pendientes")
    }

    request.estado = "rechazada"
    saveRequests(requests)
}
