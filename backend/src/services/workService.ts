import prisma from "../prisma.ts"

import {
    WORK_OPERATIONAL_STATES, 
    ASSIGNMENT_OPERATIONAL_STATES
} from "../../domain/states.ts"

import {
  calculateDeliveredLoad,
  calculateWorkOperationalState,
  calculateWorkResult,
  calculateFinalWorkResult,
  isWorkOverdue
} from "../../domain/rules.ts"

/*
|--------------------------------------------------------------------------
| REFRESH WORK STATE
|--------------------------------------------------------------------------
|
*/

export async function refreshWorkState(workId: string) {

  // obtener trabajo + asignaciones
  const work = await prisma.trabajo.findUnique({
    where: { id: workId },
    include: {
      asignaciones: true
    }
  })

  if (!work) {
    throw new Error("Trabajo no encontrado")
  }

  const manuallyClosed =
    work.estadoOperativo === WORK_OPERATIONAL_STATES.FINISHED

  const assignments = work.asignaciones

  //  calcular carga entregada
  const deliveredLoad =
    calculateDeliveredLoad(assignments)

  //  calcular estado operacional
  let estadoOperativo = work.estadoOperativo

  if (!manuallyClosed) {
    estadoOperativo =
      calculateWorkOperationalState(assignments)
  }

  //  calcular resultado
  const resultado =
    calculateWorkResult(work, assignments)

  //  actualizar en DB
  const updatedWork = await prisma.trabajo.update({
    where: { id: workId },
    data: {
      cargaEntregada: deliveredLoad,
      estadoOperativo,
      resultado
    }
  })

  return updatedWork
}

/*
|--------------------------------------------------------------------------
| FINALIZE WORK
|--------------------------------------------------------------------------
|
*/

export async function finalizeWork(workId: string) {

  const work = await prisma.trabajo.findUnique({
    where: { id: workId },
    include: {
      asignaciones: true
    }
  })

  if (!work) {
    throw new Error("Trabajo no encontrado")
  }

  const assignments = work.asignaciones

  const hasActive = assignments.some(
    a => a.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
  )

  const hasConfirmed = assignments.some(
    a => a.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED
  )

  if (hasActive || hasConfirmed) {
    throw new Error(
      "No se puede finalizar un trabajo con asignaciones pendientes"
    )
  }

  const resultadoFinal =
    calculateFinalWorkResult(work, assignments)

  const updatedWork = await prisma.trabajo.update({
    where: { id: workId },
    data: {
      estadoOperativo: WORK_OPERATIONAL_STATES.FINISHED,
      resultado: resultadoFinal
    }
  })

  return updatedWork
}

/*
|--------------------------------------------------------------------------
| FINALIZE OVERDUE WORKS
|--------------------------------------------------------------------------
|
*/

export async function finalizeOverdueWorks() {

  const works = await prisma.trabajo.findMany({
    include: {
      asignaciones: {
        include: {
          vehiculo: true,
          conductor: true
        }
      }
    }
  })

  for (const work of works) {

    if (work.estadoOperativo === "FINISHED") continue

    //  usa tu regla
    if (!isWorkOverdue(work)) continue

    for (const assignment of work.asignaciones) {

      // ACTIVE → FINISHED FAILED
      if (assignment.estadoOperativo === "ACTIVE") {

        await prisma.asignacion.update({
          where: { id: assignment.id },
          data: {
            estadoOperativo: "FINISHED",
            resultado: "FAILED"
          }
        })

        await prisma.vehiculo.update({
          where: { id: assignment.vehiculoId },
          data: { estado: "RETURNING" }
        })

        await prisma.conductor.update({
          where: { id: assignment.conductorId },
          data: { estado: "RETURNING" }
        })
      }

      // CONFIRMED → ABORTED
      if (assignment.estadoOperativo === "CONFIRMED") {

        await prisma.asignacion.update({
          where: { id: assignment.id },
          data: {
            estadoOperativo: "ABORTED"
          }
        })

        await prisma.vehiculo.update({
          where: { id: assignment.vehiculoId },
          data: { estado: "AVAILABLE" }
        })

        await prisma.conductor.update({
          where: { id: assignment.conductorId },
          data: { estado: "AVAILABLE" }
        })
      }
    }

    await prisma.trabajo.update({
      where: { id: work.id },
      data: {
        estadoOperativo: "FINISHED"
      }
    })
  }

  return works
}

/*
|--------------------------------------------------------------------------
| REOPEN WORK
|--------------------------------------------------------------------------
|
*/

export async function reopenWork(workId: string) {

  const work = await prisma.trabajo.findUnique({
    where: { id: workId },
    include: {
      asignaciones: true
    }
  })

  if (!work) {
    throw new Error("Trabajo no encontrado")
  }

  const assignments = work.asignaciones

  const estadoOperativo =
    calculateWorkOperationalState(assignments)

  const resultado =
    calculateWorkResult(work, assignments)

  const updatedWork = await prisma.trabajo.update({
    where: { id: workId },
    data: {
      estadoOperativo,
      resultado
    }
  })

  return updatedWork
}