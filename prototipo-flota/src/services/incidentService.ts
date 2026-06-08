import {
  getData,
  saveData
} from "../data/storage/localStorage"

import {
  INCIDENT_STATES
} from "../../../backend/domain/states"

import {
  addRouteEvent
} from "./routeService"



/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getIncidents() {

  return getData("incidencias")
}

function saveIncidents(
  incidents: any[]
) {

  saveData(
    "incidencias",
    incidents
  )
}

function generateId(prefix: string) {

  return `${prefix}-${crypto.randomUUID()}`
}



/*
|--------------------------------------------------------------------------
| CREATE INCIDENT
|--------------------------------------------------------------------------
|
| IMPORTANTE:
| - siempre ligada a una ruta
| - no modifica estados automáticamente
| - registra evento en ruta
|
*/

export function createIncident({

  routeId,

  tipo,

  descripcion,

  gravedad,

  reportadoPor,

  dañoEstimado = null
} : {
  routeId: string;
  tipo: string;
  descripcion: string;
  gravedad: string;
  reportadoPor: string;
  dañoEstimado?: number | null;
} ) {

  const incidents =
    getIncidents()

  const routes =
    getData("rutas")


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
  | No permitir incidencias
  | en rutas finalizadas
  |--------------------------------------------------------------------------
  */

  if (
    route.estado === "Finalizada"
  ) {

    throw new Error(
      "No se pueden registrar incidencias en rutas finalizadas"
    )
  }


  const incidentId =
    generateId("inc")


  const incident = {

    id: incidentId,

    rutaId: routeId,

    estado:
      INCIDENT_STATES.OPEN,

    tipo,

    descripcion,

    gravedad,

    dañoEstimado,

    reportadoPor,

    acciones: [],

    fechaCreacion:
      new Date().toISOString(),

    fechaCierre: null,

    cerradoPor: null
  }


  incidents.push(incident)


  /*
  |--------------------------------------------------------------------------
  | Enlazar incidencia a ruta
  |--------------------------------------------------------------------------
  */

  route.incidenciasIds.push(
    incidentId
  )


  /*
  |--------------------------------------------------------------------------
  | Registrar evento
  |--------------------------------------------------------------------------
  */

  addRouteEvent({

    routeId,

    tipo: "incidencia_reportada",

    descripcion:
      `Incidencia reportada: ${tipo}`,

    metadata: {
      incidentId,
      gravedad
    }
  })


  saveIncidents(incidents)

  saveData("rutas", routes)


  return incident
}



/*
|--------------------------------------------------------------------------
| CLOSE INCIDENT
|--------------------------------------------------------------------------
|
| Puede cerrar:
| - conductor
| - gestor de incidencias
|
*/

export function closeIncident({

  incidentId,

  cerradoPor
} : {
  incidentId: string;
  cerradoPor: string;
}) {

  const incidents =
    getIncidents()


  const incident =
    incidents.find(
      (item: any) => item.id === incidentId
    )

  if (!incident) {

    throw new Error(
      "Incidencia no encontrada"
    )
  }


  if (
    incident.estado ===
    INCIDENT_STATES.CLOSED
  ) {

    throw new Error(
      "La incidencia ya está cerrada"
    )
  }


  incident.estado =
    INCIDENT_STATES.CLOSED

  incident.fechaCierre =
    new Date().toISOString()

  incident.cerradoPor =
    cerradoPor


  /*
  |--------------------------------------------------------------------------
  | Registrar evento
  |--------------------------------------------------------------------------
  */

  addRouteEvent({

    routeId: incident.rutaId,

    tipo: "incidencia_cerrada",

    descripcion:
      "Incidencia cerrada",

    metadata: {
      incidentId: incident.id,
      cerradoPor
    }
  })


  saveIncidents(incidents)


  return incident
}



/*
|--------------------------------------------------------------------------
| ADD INCIDENT ACTION
|--------------------------------------------------------------------------
|
| Acciones tomadas por:
| - gestor de incidencias
| - conductor
|
| Ejemplos:
| - retorno ordenado
| - cambio de ruta
| - aviso de retraso
|
*/

export function addIncidentAction({

  incidentId,

  tipo,

  descripcion,

  realizadaPor,

  metadata = {}
} : {
  incidentId: string;
  tipo: string;
  descripcion: string;
  realizadaPor: string;
  metadata?: any;
}) {

  const incidents =
    getIncidents()


  const incident =
    incidents.find(
      (item: any) => item.id === incidentId
    )

  if (!incident) {

    throw new Error(
      "Incidencia no encontrada"
    )
  }


  if (
    incident.estado ===
    INCIDENT_STATES.CLOSED
  ) {

    throw new Error(
      "No se pueden agregar acciones a una incidencia cerrada"
    )
  }


  const action = {

    id: crypto.randomUUID(),

    tipo,

    descripcion,

    realizadaPor,

    metadata,

    fecha:
      new Date().toISOString()
  }


  incident.accionesTomadas.push(action)


  /*
  |--------------------------------------------------------------------------
  | Registrar evento
  |--------------------------------------------------------------------------
  */

  addRouteEvent({

    routeId: incident.rutaId,

    tipo: "accion_incidencia",

    descripcion,

    metadata: {
      incidentId,
      accionTipo: tipo
    }
  })


  saveIncidents(incidents)


  return action
}



/*
|--------------------------------------------------------------------------
| UPDATE VEHICLE STATE FROM INCIDENT
|--------------------------------------------------------------------------
|
| Permite al gestor de incidencias:
| - marcar averiado
| - mantenimiento
| - inválido
|
| IMPORTANTE:
| - NO modifica asignaciones automáticamente
|
*/

export function updateVehicleStateFromIncident({

  incidentId,

  newState
}: {
  incidentId: string;
  newState: string;
}) {

  const incidents =
    getIncidents()

  const routes =
    getData("rutas")

  const assignments =
    getData("asignaciones")

  const vehicles =
    getData("vehiculos")


  const incident =
    incidents.find(
      (item: any) => item.id === incidentId
    )

  if (!incident) {

    throw new Error(
      "Incidencia no encontrada"
    )
  }


  const route =
    routes.find(
      (item: any) =>
        item.id === incident.rutaId
    )

  if (!route) {

    throw new Error(
      "Ruta no encontrada"
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

  if (!vehicle) {

    throw new Error(
      "Vehículo no encontrado"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Actualizar estado
  |--------------------------------------------------------------------------
  */

  vehicle.estado =
    newState


  /*
  |--------------------------------------------------------------------------
  | Registrar acción automática
  |--------------------------------------------------------------------------
  */

  incident.acciones.push({

    id: crypto.randomUUID(),

    tipo: "cambio_estado_vehiculo",

    descripcion:
      `Vehículo marcado como ${newState}`,

    realizadaPor:
      "gestor_incidencias",

    fecha:
      new Date().toISOString()
  })


  /*
  |--------------------------------------------------------------------------
  | Registrar evento en ruta
  |--------------------------------------------------------------------------
  */

  addRouteEvent({

    routeId: route.id,

    tipo: "estado_vehiculo_actualizado",

    descripcion:
      `Vehículo marcado como ${newState}`,

    metadata: {
      incidentId: incident.id,
      newState
    }
  })


  saveIncidents(incidents)

  saveData("vehiculos", vehicles)


  return vehicle
}