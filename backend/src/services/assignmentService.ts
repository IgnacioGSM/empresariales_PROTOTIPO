import prisma from "../prisma"
import {
  VEHICLE_STATES,
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "../../../prototipo-flota/src/domain/states"

import {
  canAssignVehicle,
  canAssignDriver,
  vehicleSupportsLoad,
  canStartAssignment,
  canFinishAssignment,
  canAbortAssignment
} from "../../../prototipo-flota/src/domain/validators"


/*
|--------------------------------------------------------------------------
| CREATE ASSIGNMENT
|--------------------------------------------------------------------------
|
*/

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

  return await prisma.$transaction(async (tx) => {

    // 🔍 Obtener entidades
    const trabajo = await tx.trabajo.findUnique({
      where: { id: trabajoId }
    })

    if (!trabajo) throw new Error("Trabajo no encontrado")

    const vehiculo = await tx.vehiculo.findUnique({
      where: { id: vehiculoId }
    })

    if (!vehiculo) throw new Error("Vehículo no encontrado")

    const conductor = await tx.conductor.findUnique({
      where: { id: conductorId }
    })

    if (!conductor) throw new Error("Conductor no encontrado")

    // ✅ Validaciones
    if (!canAssignVehicle(vehiculo)) {
      throw new Error("Vehículo no disponible")
    }

    if (!canAssignDriver(conductor)) {
      throw new Error("Conductor no disponible")
    }

    if (!vehicleSupportsLoad(vehiculo, cargaAsignada)) {
      throw new Error("Vehículo no soporta la carga")
    }

    // ⚠️ Warning de sobrecarga
    const asignacionesPrevias = await tx.asignacion.findMany({
      where: { trabajoId }
    })

    const cargaActual = asignacionesPrevias.reduce(
      (total, a) => total + a.cargaAsignada,
      0
    )

    const warnings: string[] = []

    if (cargaActual + cargaAsignada > trabajo.cargaTotal) {
      warnings.push(
        "La carga total asignada supera la requerida"
      )
    }

    // 🆕 Crear asignación
    const asignacion = await tx.asignacion.create({
      data: {
        trabajoId,
        vehiculoId,
        conductorId,

        estadoOperativo:
          ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED,

        cargaAsignada,
        cargaEntregada: 0,

        rutaPlanificada
      }
    })

    // 🔄 Actualizar estados
    await tx.vehiculo.update({
      where: { id: vehiculoId },
      data: { estado: VEHICLE_STATES.ASSIGNED }
    })

    await tx.conductor.update({
      where: { id: conductorId },
      data: { estado: DRIVER_STATES.ASSIGNED }
    })

    return {
      asignacion,
      warnings
    }
  })
}

/*
|--------------------------------------------------------------------------
| START ASSIGNMENT
|--------------------------------------------------------------------------
|
*/

export async function startAssignment(
  assignmentId: string
) {

  return await prisma.$transaction(async (tx) => {

    // 🔍 Obtener asignación con relaciones
    const asignacion = await tx.asignacion.findUnique({
      where: { id: assignmentId },
      include: {
        vehiculo: true,
        conductor: true
      }
    })

    if (!asignacion) {
      throw new Error("Asignación no encontrada")
    }

    const { vehiculo, conductor } = asignacion

    if (!vehiculo) {
      throw new Error("Vehículo no encontrado")
    }

    if (!conductor) {
      throw new Error("Conductor no encontrado")
    }

    // ✅ Validación de negocio
    if (!canStartAssignment(asignacion, vehiculo, conductor)) {
      throw new Error("La asignación no puede iniciar")
    }

    // 🔄 Actualizar asignación
    const updatedAsignacion = await tx.asignacion.update({
      where: { id: assignmentId },
      data: {
        estadoOperativo:
          ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
      }
    })

    // 🚚 Actualizar vehículo
    await tx.vehiculo.update({
      where: { id: vehiculo.id },
      data: {
        estado: VEHICLE_STATES.IN_ROUTE
      }
    })

    // 👨‍✈️ Actualizar conductor
    await tx.conductor.update({
      where: { id: conductor.id },
      data: {
        estado: DRIVER_STATES.IN_ROUTE
      }
    })

    // 🗺️ Crear ruta
    const ruta = await tx.ruta.create({
      data: {
        asignacionId: assignmentId,
        estado: "Activa",
        horaInicio: new Date()
      }
    })

    return {
      asignacion: updatedAsignacion,
      ruta
    }
  })
}

/*
|--------------------------------------------------------------------------
| FINISH ASSIGNMENT
|--------------------------------------------------------------------------
|
*/

export async function finishAssignment({
  assignmentId,
  resultado,
  cargaEntregada
}: {
  assignmentId: string
  resultado: string
  cargaEntregada: number
}) {

  return await prisma.$transaction(async (tx) => {

    // 🔍 Obtener asignación con ruta
    const asignacion = await tx.asignacion.findUnique({
      where: { id: assignmentId },
      include: {
        ruta: true
      }
    })

    if (!asignacion) {
      throw new Error("Asignación no encontrada")
    }

    // ✅ Validación de negocio
    if (!canFinishAssignment(asignacion)) {
      throw new Error("La asignación no puede finalizar")
    }

    // 🔄 Actualizar asignación
    const updatedAsignacion = await tx.asignacion.update({
      where: { id: assignmentId },
      data: {
        estadoOperativo:
          ASSIGNMENT_OPERATIONAL_STATES.FINISHED,
        resultado,
        cargaEntregada
      }
    })

    // 🗺️ Cerrar ruta (si existe)
    if (asignacion.ruta) {
      await tx.ruta.update({
        where: { id: asignacion.ruta.id },
        data: {
          horaFin: new Date(),
          estado: "Finalizada"
        }
      })
    }

    return updatedAsignacion
  })
}

/*
|--------------------------------------------------------------------------
| ABORT ASSIGNMENT
|--------------------------------------------------------------------------
|
*/

export async function abortAssignment({
  assignmentId,
  liberarVehiculo = false,
  liberarConductor = true,
  estadoVehiculoPosterior = null
}: {
  assignmentId: string
  liberarVehiculo?: boolean
  liberarConductor?: boolean
  estadoVehiculoPosterior?: string | null
}) {

  return await prisma.$transaction(async (tx) => {

    // 🔍 Obtener asignación con relaciones
    const asignacion = await tx.asignacion.findUnique({
      where: { id: assignmentId },
      include: {
        vehiculo: true,
        conductor: true
      }
    })

    if (!asignacion) {
      throw new Error("Asignación no encontrada")
    }

    const { vehiculo, conductor } = asignacion

    if (!vehiculo) {
      throw new Error("Vehículo no encontrado")
    }

    if (!conductor) {
      throw new Error("Conductor no encontrado")
    }

    // ✅ Validación
    if (!canAbortAssignment(asignacion)) {
      throw new Error("La asignación no puede abortarse")
    }

    // 🔄 Actualizar asignación
    const updatedAsignacion = await tx.asignacion.update({
      where: { id: assignmentId },
      data: {
        estadoOperativo:
          ASSIGNMENT_OPERATIONAL_STATES.ABORTED
      }
    })

    // 🚚 Liberar vehículo (si corresponde)
    if (liberarVehiculo) {
      await tx.vehiculo.update({
        where: { id: vehiculo.id },
        data: {
          estado:
            estadoVehiculoPosterior ||
            VEHICLE_STATES.AVAILABLE
        }
      })
    }

    // 👨‍✈️ Liberar conductor (si corresponde)
    if (liberarConductor) {
      await tx.conductor.update({
        where: { id: conductor.id },
        data: {
          estado: DRIVER_STATES.AVAILABLE
        }
      })
    }

    return updatedAsignacion
  })
}