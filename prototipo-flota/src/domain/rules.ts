import {
  WORK_OPERATIONAL_STATES,
  WORK_RESULTS,
  ASSIGNMENT_OPERATIONAL_STATES,
  ASSIGNMENT_RESULTS
} from "./states"



/*
|--------------------------------------------------------------------------
| CARGA ENTREGADA
|--------------------------------------------------------------------------
*/

export function calculateDeliveredLoad(assignments: any[]) {

  return assignments.reduce(
    (total, assignment) =>
      total + (assignment.cargaEntregada || 0),
    0
  )
}



/*
|--------------------------------------------------------------------------
| ESTADOS OPERATIVOS DEL TRABAJO
|--------------------------------------------------------------------------
*/

export function hasActiveAssignments(assignments: any[]) {

  return assignments.some(
    assignment =>
      assignment.estadoOperativo ===
      ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
  )
}

export function hasConfirmedAssignments(assignments: any[]) {

  return assignments.some(
    assignment =>
      assignment.estadoOperativo ===
      ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED
  )
}

export function allAssignmentsFinished(assignments: any[]) {

  return (
    assignments.length > 0 &&
    assignments.every(
      assignment =>
        assignment.estadoOperativo ===
        ASSIGNMENT_OPERATIONAL_STATES.FINISHED
    )
  )
}



/*
|--------------------------------------------------------------------------
| CALCULO ESTADO OPERATIVO DEL TRABAJO
|--------------------------------------------------------------------------
|
| IMPORTANTE:
| - El trabajo NO se finaliza automáticamente.
| - El cierre depende del gestor o del vencimiento.
| - Este cálculo solo representa el estado operacional actual.
|
*/

export function calculateWorkOperationalState(
  assignments: any[]
) {

  if (!assignments.length) {
    return WORK_OPERATIONAL_STATES.PENDING
  }

  if (hasActiveAssignments(assignments)) {
    return WORK_OPERATIONAL_STATES.IN_PROGRESS
  }

  if (hasConfirmedAssignments(assignments)) {
    return WORK_OPERATIONAL_STATES.ASSIGNED
  }

  /*
    Si no hay activas ni confirmadas,
    el trabajo vuelve a Pendiente.

    Esto permite:
    - crear nuevas asignaciones
    - reintentar operaciones
  */

  return WORK_OPERATIONAL_STATES.PENDING
}



/*
|--------------------------------------------------------------------------
| RESULTADO DINAMICO DEL TRABAJO
|--------------------------------------------------------------------------
|
| Representa el progreso actual del cumplimiento.
|
| NO implica cierre del trabajo.
|
*/

export function calculateWorkResult(
  work: any,
  assignments: any[]
) {

  const deliveredLoad =
    calculateDeliveredLoad(assignments)

  /*
    Objetivo completo alcanzado
  */

  if (
    deliveredLoad >=
    work.cargaTotalRequerida
  ) {

    return WORK_RESULTS.SUCCESS
  }

  /*
    Hay avance parcial
  */

  if (deliveredLoad > 0) {

    return WORK_RESULTS.PARTIAL
  }

  /*
    Aún no existe progreso
  */

  return null
}



/*
|--------------------------------------------------------------------------
| RESULTADO FINAL DEL TRABAJO
|--------------------------------------------------------------------------
|
| Se usa SOLO cuando:
| - el gestor finaliza manualmente
| - o vence la fecha límite
|
*/

export function calculateFinalWorkResult(
  work: any,
  assignments: any[]
) {

  const deliveredLoad =
    calculateDeliveredLoad(assignments)

  /*
    Se cumplió toda la carga requerida
  */

  if (
    deliveredLoad >=
    work.cargaTotalRequerida
  ) {

    return WORK_RESULTS.SUCCESS
  }

  /*
    Se entregó parte de la carga
  */

  if (deliveredLoad > 0) {

    return WORK_RESULTS.PARTIAL
  }

  /*
    No se entregó nada
  */

  return WORK_RESULTS.FAILED
}



/*
|--------------------------------------------------------------------------
| FECHA LIMITE
|--------------------------------------------------------------------------
*/

export function isWorkOverdue(
  work: any
) {

  const now = new Date()

  const deadline =
    new Date(work.fechaLimite)

  return now > deadline
}



/*
|--------------------------------------------------------------------------
| ASIGNACIONES PARCIALES
|--------------------------------------------------------------------------
*/

export function hasPartialAssignments(
  assignments: any[]
) {

  return assignments.some(
    assignment =>
      assignment.resultado ===
      ASSIGNMENT_RESULTS.PARTIAL
  )
}



/*
|--------------------------------------------------------------------------
| ASIGNACIONES FALLIDAS
|--------------------------------------------------------------------------
*/

export function hasFailedAssignments(
  assignments: any[]
) {

  return assignments.some(
    assignment =>
      assignment.resultado ===
      ASSIGNMENT_RESULTS.FAILED
  )
}