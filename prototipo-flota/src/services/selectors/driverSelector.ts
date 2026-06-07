import { getData } from "../../data/storage/localStorage"

import {
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "../../../../backend/domain/states"



/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getDriverById(driverId: string) {

  const drivers =
    getData("conductores")

  return drivers.find(
    (driver: any) => driver.id === driverId
  )
}

function getAssignmentById(id: string) {

  const assignments =
    getData("asignaciones")

  return assignments.find(
    (item: any) => item.id === id
  )
}

function getWorkById(id: string) {

  const works =
    getData("trabajos")

  return works.find(
    (item: any) => item.id === id
  )
}

function getRouteById(id: string) {

  const routes =
    getData("rutas")

  return routes.find(
    (item: any) => item.id === id
  )
}



/*
|--------------------------------------------------------------------------
| GET DRIVER CURRENT ASSIGNMENT
|--------------------------------------------------------------------------
*/

export function getDriverCurrentAssignment(
  driverId: string
) {

  const assignments =
    getData("asignaciones")

  return assignments.find(
    (assignment: any) =>
      assignment.conductorId === driverId &&
      (
        assignment.estadoOperativo ===
          ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED ||

        assignment.estadoOperativo ===
          ASSIGNMENT_OPERATIONAL_STATES.ACTIVE ||

        assignment.estadoOperativo ===
          ASSIGNMENT_OPERATIONAL_STATES.FINISHED
      )
  )
}



/*
|--------------------------------------------------------------------------
| GET DRIVER DASHBOARD
|--------------------------------------------------------------------------
|
| Selector principal de la UI del conductor.
|
*/

export function getDriverDashboard(
  driverId: string
) {

  const driver =
    getDriverById(driverId)

  if (!driver) {

    throw new Error(
      "Conductor no encontrado"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Disponible
  |--------------------------------------------------------------------------
  */

  if (
    driver.estado ===
    DRIVER_STATES.AVAILABLE
  ) {

    return {

      estado:
        DRIVER_STATES.AVAILABLE,

      driver,

      assignment: null,

      work: null,

      route: null,

      incidents: [],

      availableActions: []
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Obtener asignación
  |--------------------------------------------------------------------------
  */

  const assignment =
    getAssignmentById(
      driver.asignacionActivaId
    )

  if (!assignment) {

    return {

      estado: driver.estado,

      driver,

      assignment: null,

      work: null,

      route: null,

      incidents: [],

      availableActions: []
    }
  }


  const work =
    getWorkById(
      assignment.trabajoId
    )

  const route =
    assignment.rutaRealId
      ? getRouteById(
          assignment.rutaRealId
        )
      : null


  const incidents =
    route
      ? getData("incidencias")
          .filter(
            (incident: any) =>
              incident.rutaId === route.id
          )
      : []


  /*
  |--------------------------------------------------------------------------
  | Acciones disponibles
  |--------------------------------------------------------------------------
  */

  let availableActions = [] as string[]


  /*
  --------------------------------------------------------------------------
  | Asignado
  --------------------------------------------------------------------------
  */

  if (
    driver.estado ===
    DRIVER_STATES.ASSIGNED
  ) {

    availableActions = [

      "start_route",

      "report_problem"
    ]
  }


  /*
  --------------------------------------------------------------------------
  | En ruta
  --------------------------------------------------------------------------
  */

  if (
    driver.estado ===
    DRIVER_STATES.IN_ROUTE
  ) {

    availableActions = [

      "report_incident",

      "finish_delivery"
    ]
  }


  /*
  --------------------------------------------------------------------------
  | Retornando
  --------------------------------------------------------------------------
  */

  if (
    driver.estado ===
    DRIVER_STATES.RETURNING
  ) {

    availableActions = [

      "report_incident",

      "complete_return"
    ]
  }


  return {

    estado: driver.estado,

    driver,

    assignment,

    work,

    route,

    incidents,

    availableActions
  }
}