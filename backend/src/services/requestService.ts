import prisma from "../prisma"
import { WORK_OPERATIONAL_STATES } from "../../domain/states"

/*
|--------------------------------------------------------------------------
| GET ALL REQUESTS
|--------------------------------------------------------------------------
*/

export async function getAllRequests() {
    return await prisma.solicitud.findMany({
        include: {
            trabajo: true
        }
    })
}

/*
|--------------------------------------------------------------------------
| CREATE REQUEST
|--------------------------------------------------------------------------
|
*/

export async function createRequest(data: {
    cliente: string,
    destino: string,
    capacidadCargaNecesaria: number,
    fechaLimiteEntrega: string,
    descripcion?: string
}) {

  return await prisma.solicitud.create({
    data: {
      cliente: data.cliente,
      destino: data.destino,
      cargaRequerida: data.capacidadCargaNecesaria,
      fechaLimite: new Date(data.fechaLimiteEntrega),

      estado: "Pendiente",

      descripcion: data.descripcion || "",
      fechaCreacion: new Date()
    }
  })
}

/*
|--------------------------------------------------------------------------
| APPROVE REQUEST
|--------------------------------------------------------------------------
|
*/

export async function approveRequest({ requestId, aprobadoPor } : { requestId: string, aprobadoPor: string }) {

  const solicitud = await prisma.solicitud.findUnique({
    where: { id: requestId }
  })

  if (!solicitud) throw new Error("Solicitud no encontrada")

  if (solicitud.estado !== "Pendiente") {
    throw new Error("Solo solicitudes pendientes pueden aprobarse")
  }

  return await prisma.$transaction(async (tx) => {

    const updatedSolicitud = await tx.solicitud.update({
      where: { id: requestId },
      data: {
        estado: "Aprobada",
        fechaAprobacion: new Date(),
        aprobadoPor
      }
    })

    const trabajo = await tx.trabajo.create({
      data: {
        solicitudId: requestId,
        estadoOperativo: "Pendiente",

        cargaTotal: solicitud.cargaRequerida,
        cargaEntregada: 0
      }
    })

    return {
      solicitud: updatedSolicitud,
      trabajo
    }
  })
}

/*
|--------------------------------------------------------------------------
| REJECT REQUEST
|--------------------------------------------------------------------------
|
*/

export async function rejectRequest({
  requestId,
  rechazadoPor,
  motivoRechazo
} : {
    requestId: string,
    rechazadoPor: string,
    motivoRechazo: string
}) {

  const solicitud = await prisma.solicitud.findUnique({
    where: { id: requestId }
  })

  if (!solicitud) throw new Error("Solicitud no encontrada")

  if (solicitud.estado !== "Pendiente") {
    throw new Error("Solo solicitudes pendientes pueden rechazarse")
  }

  return await prisma.solicitud.update({
    where: { id: requestId },
    data: {
      estado: "Rechazada",
      fechaRechazo: new Date(),
      rechazadoPor,
      motivoRechazo
    }
  })
}