import {
  getData,
  saveData
} from "../data/storage/localStorage"

import {
  ROUTE_STATES,
  VEHICLE_STATES,
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "../../../backend/domain/states"

import {
  refreshWorkState
} from "./OLD_workService"



/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getRoutes() {

  return getData("rutas")
}

function saveRoutes(routes: any[]) {

  saveData("rutas", routes)
}



/*
|--------------------------------------------------------------------------
| ADD ROUTE EVENT
|--------------------------------------------------------------------------
|
| Registra eventos cronológicos:
| - incidencias
| - cambios de ruta
| - retornos
| - acciones del gestor
|
*/

export function addRouteEvent({
  routeId,
  tipo,
  descripcion,
  metadata = {}
}: {
  routeId: string;
  tipo: string;
  descripcion: string;
  metadata?: any;
}) {

  const routes = getRoutes()


  const route = routes.find(
    (item: any) => item.id === routeId
  )

  if (!route) {

    throw new Error(
      "Ruta no encontrada"
    )
  }


  const event = {

    id: crypto.randomUUID(),

    tipo,

    descripcion,

    metadata,

    fecha:
      new Date().toISOString()
  }


  route.eventos.push(event)


  saveRoutes(routes)


  return event
}



/*
|--------------------------------------------------------------------------
| START RETURN
|--------------------------------------------------------------------------
|
| La entrega terminó.
| El vehículo y conductor regresan
| a sucursal.
|
| IMPORTANTE:
| - NO libera recursos aún
| - la ruta sigue activa
|
*/

export function startReturn({
  assignmentId,
  resultado,
  cargaEntregada
}: {
  assignmentId: string;
  resultado: string;
  cargaEntregada: number;
}) {

  const assignments =
    getData("asignaciones")

  const vehicles =
    getData("vehiculos")

  const drivers =
    getData("conductores")

  const routes =
    getRoutes()


  const assignment =
    assignments.find(
      (item: any) => item.id === assignmentId
    )

  if (!assignment) {

    throw new Error(
      "Asignación no encontrada"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Validar estado
  |--------------------------------------------------------------------------
  */

  if (
    assignment.estadoOperativo !==
    ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
  ) {

    throw new Error(
      "Solo asignaciones activas pueden iniciar retorno"
    )
  }


  const vehicle =
    vehicles.find(
      (item: any) =>
        item.id ===
        assignment.vehiculoId
    )
  if (!vehicle) {

    throw new Error(
      "Vehículo no encontrado"
    )
  }

  const driver =
    drivers.find(
      (item: any) =>
        item.id ===
        assignment.conductorId
    )

    if (!driver) {
    throw new Error(
      "Conductor no encontrado"
    )
  }

  const route =
    routes.find(
      (item: any) =>
        item.id ===
        assignment.rutaRealId
    )

  if (!route) {

    throw new Error(
      "Ruta no encontrada"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Finalizar asignación
  |--------------------------------------------------------------------------
  */

  assignment.estadoOperativo =
    ASSIGNMENT_OPERATIONAL_STATES.FINISHED

  assignment.resultado =
    resultado

  assignment.cargaEntregada =
    cargaEntregada


  /*
  |--------------------------------------------------------------------------
  | Ruta pasa a retorno
  |--------------------------------------------------------------------------
  */

  route.estado =
    ROUTE_STATES.RETURNING


  /*
  |--------------------------------------------------------------------------
  | Recursos siguen fuera
  |--------------------------------------------------------------------------
  */

  if (vehicle) {

    vehicle.estado =
      VEHICLE_STATES.RETURNING
  }

  if (driver) {

    driver.estado =
      DRIVER_STATES.RETURNING
  }


  /*
  |--------------------------------------------------------------------------
  | Registrar evento
  |--------------------------------------------------------------------------
  */

  route.eventos.push({

    id: crypto.randomUUID(),

    tipo: "retorno_iniciado",

    descripcion:
      "Vehículo y conductor iniciaron retorno a sucursal",

    fecha:
      new Date().toISOString()
  })


  saveData(
    "asignaciones",
    assignments
  )

  saveData(
    "vehiculos",
    vehicles
  )

  saveData(
    "conductores",
    drivers
  )

  saveRoutes(routes)


  refreshWorkState(
    assignment.trabajoId
  )


  return assignment
}



/*
|--------------------------------------------------------------------------
| COMPLETE RETURN
|--------------------------------------------------------------------------
|
| El vehículo y conductor
| regresaron a sucursal.
|
| Aquí sí:
| - se liberan recursos
| - se finaliza la ruta
|
*/

export function completeReturn(
  routeId: string
) {

  const routes = getRoutes()

  const assignments =
    getData("asignaciones")

  const vehicles =
    getData("vehiculos")

  const drivers =
    getData("conductores")


  const route =
    routes.find(
      (item: any) => item.id === routeId
    )

  if (!route) {

    throw new Error(
      "Ruta no encontrada"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Validar estado
  |--------------------------------------------------------------------------
  */

  if (
    route.estado !==
    ROUTE_STATES.RETURNING
  ) {

    throw new Error(
      "La ruta no está en retorno"
    )
  }


  const assignment =
    assignments.find(
      (item: any) =>
        item.id ===
        route.asignacionId
    )

  if (!assignment) {

    throw new Error(
      "Asignación no encontrada"
    )
  }


  const vehicle =
    vehicles.find(
      (item: any) =>
        item.id ===
        assignment.vehiculoId
    )

  const driver =
    drivers.find(
      (item: any) =>
        item.id ===
        assignment.conductorId
    )


  /*
  |--------------------------------------------------------------------------
  | Finalizar ruta
  |--------------------------------------------------------------------------
  */

  route.estado =
    ROUTE_STATES.FINISHED

  route.horaFin =
    new Date().toISOString()


  /*
  |--------------------------------------------------------------------------
  | Liberar recursos
  |--------------------------------------------------------------------------
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


  /*
  |--------------------------------------------------------------------------
  | Registrar evento
  |--------------------------------------------------------------------------
  */

  route.eventos.push({

    id: crypto.randomUUID(),

    tipo: "retorno_completado",

    descripcion:
      "Vehículo y conductor regresaron a sucursal",

    fecha:
      new Date().toISOString()
  })


  saveRoutes(routes)

  saveData(
    "vehiculos",
    vehicles
  )

  saveData(
    "conductores",
    drivers
  )


  return route
}