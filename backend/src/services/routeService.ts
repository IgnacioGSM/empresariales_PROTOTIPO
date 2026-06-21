import prisma from "../prisma.ts"

import {
  ROUTE_STATES,
  VEHICLE_STATES,
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "../../domain/states.ts"

import {
    refreshWorkState
} from "../services/workService.ts"

export async function addRouteEvent({
  routeId,
  tipo,
  descripcion,
  metadata = {}
}: {
  routeId: string
  tipo: string
  descripcion: string
  metadata?: any
}) {

  const route = await prisma.ruta.findUnique({
    where: { id: routeId }
  })

  if (!route) {
    throw new Error("Ruta no encontrada")
  }

  const event = await prisma.rutaEvento.create({
    data: {
      rutaId: routeId,
      tipo,
      descripcion,
      metadata
    }
  })

  return event
}

export async function startReturn({
  assignmentId,
  resultado,
  cargaEntregada
}: {
  assignmentId: string
  resultado: string
  cargaEntregada: number
}) {

  return await prisma.$transaction(async (tx) => {

    const assignment = await tx.asignacion.findUnique({
      where: { id: assignmentId },
      include: { ruta: true }
    })

    if (!assignment) {
      throw new Error("Asignación no encontrada")
    }

    if (assignment.estadoOperativo !== ASSIGNMENT_OPERATIONAL_STATES.ACTIVE) {
      throw new Error("Solo asignaciones activas pueden iniciar retorno")
    }

    const route = await tx.ruta.findUnique({
      where: { asignacionId: assignmentId }
    })

    if (!route) {
      throw new Error("Ruta no encontrada")
    }

    //  1 finalizar asignación
    await tx.asignacion.update({
      where: { id: assignmentId },
      data: {
        estadoOperativo: ASSIGNMENT_OPERATIONAL_STATES.FINISHED,
        resultado
      }
    })

    //  2 actualizar ruta
    await tx.ruta.update({
      where: { id: route.id },
      data: {
        estado: ROUTE_STATES.RETURNING
      }
    })

    //  3 actualizar recursos
    await tx.vehiculo.update({
      where: { id: assignment.vehiculoId },
      data: { estado: VEHICLE_STATES.RETURNING }
    })

    await tx.conductor.update({
      where: { id: assignment.conductorId },
      data: { estado: DRIVER_STATES.RETURNING }
    })

    //  4 evento
    await tx.rutaEvento.create({
      data: {
        rutaId: route.id,
        tipo: "retorno_iniciado",
        descripcion: "Vehículo y conductor iniciaron retorno"
      }
    })

    //  5 refresh trabajo (fuera o dentro, ambas válidas)
    await refreshWorkState(assignment.trabajoId)

    return { success: true }
  })
}

export async function completeReturn(routeId: string) {

  return await prisma.$transaction(async (tx) => {

    const route = await tx.ruta.findUnique({
      where: { id: routeId },
      include: {
        asignacion: true
      }
    })

    if (!route) {
      throw new Error("Ruta no encontrada")
    }

    if (route.estado !== ROUTE_STATES.RETURNING) {
      throw new Error("La ruta no está en retorno")
    }

    const assignment = route.asignacion

    //  1 finalizar ruta
    await tx.ruta.update({
      where: { id: routeId },
      data: {
        estado: ROUTE_STATES.FINISHED,
        horaFin: new Date()
      }
    })

    //  2 liberar recursos
    await tx.vehiculo.update({
      where: { id: assignment.vehiculoId },
      data: { estado: VEHICLE_STATES.AVAILABLE }
    })

    await tx.conductor.update({
      where: { id: assignment.conductorId },
      data: { estado: DRIVER_STATES.AVAILABLE }
    })

    //  3 evento
    await tx.rutaEvento.create({
      data: {
        rutaId: routeId,
        tipo: "retorno_completado",
        descripcion: "Vehículo y conductor regresaron a sucursal"
      }
    })

    return route
  })
}