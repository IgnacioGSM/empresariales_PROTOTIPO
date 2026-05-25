import {
  getData,
  saveData
} from "../storage/localStorage"

import {
  WORK_OPERATIONAL_STATES,
  ASSIGNMENT_OPERATIONAL_STATES,
  ASSIGNMENT_RESULTS,
  VEHICLE_STATES,
  DRIVER_STATES
} from "../domain/states"

import {
  calculateDeliveredLoad,
  calculateWorkOperationalState,
  calculateWorkResult,
  calculateFinalWorkResult,
  isWorkOverdue
} from "../domain/rules"



/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getWorks() {

  return getData("trabajos")
}

function saveWorks(works: any[]) {

  saveData("trabajos", works)
}



/*
|--------------------------------------------------------------------------
| REFRESH WORK STATE
|--------------------------------------------------------------------------
|
| Recalcula automáticamente:
| - estado operacional
| - carga entregada
| - resultado dinámico
|
| IMPORTANTE:
| - NO finaliza automáticamente el trabajo
| - NO reemplaza cierres manuales
|
*/

export function refreshWorkState(
  workId: string | null
) {

  const works = getWorks()

  const assignments =
    getData("asignaciones")


  const work = works.find(
    (item: any) => item.id === workId
  )

  if (!work) {
    throw new Error(
      "Trabajo no encontrado"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Si el trabajo ya fue finalizado manualmente,
  | no se recalcula el estado operacional.
  |--------------------------------------------------------------------------
  */

  const manuallyClosed =
    work.estadoOperativo ===
    WORK_OPERATIONAL_STATES.FINISHED


  const relatedAssignments =
    assignments.filter(
      (assignment: any) =>
        assignment.trabajoId === workId
    )


  /*
  |--------------------------------------------------------------------------
  | CARGA ENTREGADA
  |--------------------------------------------------------------------------
  */

  const deliveredLoad =
    calculateDeliveredLoad(
      relatedAssignments
    )

  work.cargaEntregada =
    deliveredLoad


  /*
  |--------------------------------------------------------------------------
  | ESTADO OPERACIONAL
  |--------------------------------------------------------------------------
  */

  if (!manuallyClosed) {

    work.estadoOperativo =
      calculateWorkOperationalState(
        relatedAssignments
      )
  }


  /*
  |--------------------------------------------------------------------------
  | RESULTADO DINÁMICO
  |--------------------------------------------------------------------------
  */

  work.resultado =
    calculateWorkResult(
      work,
      relatedAssignments
    )


  /*
  |--------------------------------------------------------------------------
  | FECHA ACTUALIZACIÓN
  |--------------------------------------------------------------------------
  */

  work.fechaActualizacion =
    new Date().toISOString()


  saveWorks(works)


  return work
}



/*
|--------------------------------------------------------------------------
| FINALIZAR TRABAJO MANUALMENTE
|--------------------------------------------------------------------------
|
| El gestor decide:
| - que no se crearán más asignaciones
| - que la operación terminó oficialmente
|
*/

export function finalizeWork(
  workId: string
) {

  const works = getWorks()

  const assignments =
    getData("asignaciones")


  const work = works.find(
    (item: any) => item.id === workId
  )

  if (!work) {
    throw new Error(
      "Trabajo no encontrado"
    )
  }

  


  const relatedAssignments =
    assignments.filter(
      (assignment: any) =>
        assignment.trabajoId === workId
    )

  const hasActive =
  relatedAssignments.some(
    (assignment: any) =>
      assignment.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
  )

const hasConfirmed =
  relatedAssignments.some(
    (assignment: any) =>
      assignment.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED
  )

if (hasActive || hasConfirmed) {

  throw new Error(
    "No se puede finalizar un trabajo con asignaciones pendientes"
  )
}


  /*
  |--------------------------------------------------------------------------
  | ESTADO FINAL
  |--------------------------------------------------------------------------
  */

  work.estadoOperativo =
    WORK_OPERATIONAL_STATES.FINISHED


  /*
  |--------------------------------------------------------------------------
  | RESULTADO FINAL
  |--------------------------------------------------------------------------
  */

  work.resultado =
    calculateFinalWorkResult(
      work,
      relatedAssignments
    )


  /*
  |--------------------------------------------------------------------------
  | METADATA CIERRE
  |--------------------------------------------------------------------------
  */

  work.fechaFinalizacion =
    new Date().toISOString()

  work.cerradoPor = "gestor"


  saveWorks(works)


  return work
}



/*
|--------------------------------------------------------------------------
| FINALIZAR TRABAJOS VENCIDOS
|--------------------------------------------------------------------------
|
| Puede ejecutarse:
| - al iniciar aplicación
| - periódicamente
| - antes de mostrar trabajos
|
*/

export function finalizeOverdueWorks() {

  const works = getWorks()

  const assignments =
    getData("asignaciones")

  const vehicles =
    getData("vehiculos")

  const drivers =
    getData("conductores")

  let updated = false


  for (const work of works) {

    /*
    |--------------------------------------------------------------------------
    | Ignorar trabajos ya finalizados
    |--------------------------------------------------------------------------
    */

    if (
      work.estadoOperativo ===
      WORK_OPERATIONAL_STATES.FINISHED
    ) {
      continue
    }


    /*
    |--------------------------------------------------------------------------
    | Verificar vencimiento
    |--------------------------------------------------------------------------
    */

    if (!isWorkOverdue(work)) {
      continue
    }


    const relatedAssignments =
      assignments.filter(
        (assignment: any) =>
          assignment.trabajoId === work.id
      )


    /*
    |--------------------------------------------------------------------------
    | Procesar asignaciones activas
    |--------------------------------------------------------------------------
    */

    for (const assignment of relatedAssignments) {

      const vehicle = vehicles.find(
        (vehicle: any) =>
          vehicle.id ===
          assignment.vehiculoId
      )

      const driver = drivers.find(
        (driver: any) =>
          driver.id ===
          assignment.conductorId
      )


      /*
      ------------------------------------------------------------------------
      | Asignaciones activas
      ------------------------------------------------------------------------
      */

      if (
        assignment.estadoOperativo ===
        ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
      ) {

        assignment.estadoOperativo =
          ASSIGNMENT_OPERATIONAL_STATES.FINISHED

        assignment.resultado =
          ASSIGNMENT_RESULTS.FAILED


        /*
        ----------------------------------------------------------------------
        | Vehículo y conductor aún siguen fuera
        ----------------------------------------------------------------------
        */

        if (vehicle) {

          vehicle.estado =
            VEHICLE_STATES.RETURNING
        }

        if (driver) {

          driver.estado =
            DRIVER_STATES.RETURNING
        }
      }


      /*
      ------------------------------------------------------------------------
      | Asignaciones confirmadas
      ------------------------------------------------------------------------
      */

      if (
        assignment.estadoOperativo ===
        ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED
      ) {

        assignment.estadoOperativo =
          ASSIGNMENT_OPERATIONAL_STATES.ABORTED


        /*
        ----------------------------------------------------------------------
        | Recursos nunca salieron
        ----------------------------------------------------------------------
        */

        if (vehicle) {

          vehicle.estado =
            VEHICLE_STATES.AVAILABLE

          vehicle.asignacionActivaId =
            null
        }

        if (driver) {

          driver.estado =
            DRIVER_STATES.AVAILABLE

          driver.asignacionActivaId =
            null
        }
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Finalizar trabajo
    |--------------------------------------------------------------------------
    */

    work.estadoOperativo =
      WORK_OPERATIONAL_STATES.FINISHED

    work.resultado =
      calculateFinalWorkResult(
        work,
        relatedAssignments
      )

    work.fechaFinalizacion =
      new Date().toISOString()

    work.cerradoPor = "sistema"


    updated = true
  }


  if (updated) {

    saveWorks(works)

    saveData("asignaciones", assignments)

    saveData("vehiculos", vehicles)

    saveData("conductores", drivers)
  }


  return works
}



/*
|--------------------------------------------------------------------------
| REABRIR TRABAJO
|--------------------------------------------------------------------------
|
| Permite volver a crear asignaciones
| después de un cierre manual.
|
| IMPORTANTE:
| - no elimina historial
| - solo reactiva operación
|
*/

export function reopenWork(
  workId: string
) {

  const works = getWorks()

  const assignments =
    getData("asignaciones")


  const work = works.find(
    (item: any) => item.id === workId
  )

  if (!work) {
    throw new Error(
      "Trabajo no encontrado"
    )
  }


  work.fechaFinalizacion = null

  work.cerradoPor = null


  /*
  |--------------------------------------------------------------------------
  | Recalcular estado automáticamente
  |--------------------------------------------------------------------------
  */

  const relatedAssignments =
    assignments.filter(
      (assignment: any) =>
        assignment.trabajoId === workId
    )

  work.estadoOperativo =
    calculateWorkOperationalState(
      relatedAssignments
    )

  work.resultado =
    calculateWorkResult(
      work,
      relatedAssignments
    )


  work.fechaActualizacion =
    new Date().toISOString()


  saveWorks(works)


  return work
}