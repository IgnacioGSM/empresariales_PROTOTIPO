import { getData, saveData } from "../storage/localStorage"
import { INCIDENT_STATES } from "../domain/states"
import { addRouteEvent } from "../service/routeService"

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export type IncidentAction = {
  id: string
  tipo: string
  descripcion: string
  realizadaPor: string
  metadata?: any
  fecha: string
}

export type Incident = {
  id: string
  rutaId: string
  estado: string
  tipo: string
  descripcion: string
  gravedad: string
  dañoEstimado: number | null
  reportadoPor: string
  acciones: IncidentAction[]
  fechaCreacion: string
  fechaCierre: string | null
  cerradoPor: string | null
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getIncidents(): Incident[] {
  return getData("incidencias") || []
}

function saveIncidents(incidents: Incident[]): void {
  saveData("incidencias", incidents)
}

function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

/*
|--------------------------------------------------------------------------
| GETTERS (IMPORTANTE PARA LA UI)
|--------------------------------------------------------------------------
*/

export function getAllIncidents(): Incident[] {
  return getIncidents()
}

export function getOpenIncidents(): Incident[] {
  return getIncidents().filter(
    (inc) => inc.estado === INCIDENT_STATES.OPEN
  )
}

export function getIncidentById(id: string): Incident | undefined {
  return getIncidents().find((inc) => inc.id === id)
}

/*
|--------------------------------------------------------------------------
| CREATE INCIDENT
|--------------------------------------------------------------------------
*/

export function createIncident({
  routeId,
  tipo,
  descripcion,
  gravedad,
  reportadoPor,
  dañoEstimado = null
}: {
  routeId: string
  tipo: string
  descripcion: string
  gravedad: string
  reportadoPor: string
  dañoEstimado?: number | null
}) {
  const incidents = getIncidents()
  const routes = getData("rutas") || []

  const route = routes.find((r: any) => r.id === routeId)

  if (!route) {
    throw new Error("Ruta no encontrada")
  }

  if (route.estado === "Finalizada") {
    throw new Error("No se pueden registrar incidencias en rutas finalizadas")
  }

  const incidentId = generateId("inc")

  const incident: Incident = {
    id: incidentId,
    rutaId: routeId,
    estado: INCIDENT_STATES.OPEN,
    tipo,
    descripcion,
    gravedad,
    dañoEstimado,
    reportadoPor,
    acciones: [],
    fechaCreacion: new Date().toISOString(),
    fechaCierre: null,
    cerradoPor: null
  }

  incidents.push(incident)

  route.incidenciasIds.push(incidentId)

  addRouteEvent({
    routeId,
    tipo: "incidencia_reportada",
    descripcion: `Incidencia reportada: ${tipo}`,
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
*/

export function closeIncident({
  incidentId,
  cerradoPor
}: {
  incidentId: string
  cerradoPor: string
}) {
  const incidents = getIncidents()

  const incident = incidents.find((i) => i.id === incidentId)

  if (!incident) {
    throw new Error("Incidencia no encontrada")
  }

  if (incident.estado === INCIDENT_STATES.CLOSED) {
    throw new Error("La incidencia ya está cerrada")
  }

  incident.estado = INCIDENT_STATES.CLOSED
  incident.fechaCierre = new Date().toISOString()
  incident.cerradoPor = cerradoPor

  addRouteEvent({
    routeId: incident.rutaId,
    tipo: "incidencia_cerrada",
    descripcion: "Incidencia cerrada",
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
*/

export function addIncidentAction({
  incidentId,
  tipo,
  descripcion,
  realizadaPor,
  metadata = {}
}: {
  incidentId: string
  tipo: string
  descripcion: string
  realizadaPor: string
  metadata?: any
}) {
  const incidents = getIncidents()

  const incident = incidents.find((i) => i.id === incidentId)

  if (!incident) {
    throw new Error("Incidencia no encontrada")
  }

  if (incident.estado === INCIDENT_STATES.CLOSED) {
    throw new Error("No se pueden agregar acciones a una incidencia cerrada")
  }

  const action: IncidentAction = {
    id: crypto.randomUUID(),
    tipo,
    descripcion,
    realizadaPor,
    metadata,
    fecha: new Date().toISOString()
  }

  incident.acciones.push(action)

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
*/

export function updateVehicleStateFromIncident({
  incidentId,
  newState
}: {
  incidentId: string
  newState: string
}) {
  const incidents = getIncidents()
  const routes = getData("rutas") || []
  const assignments = getData("asignaciones") || []
  const vehicles = getData("vehiculos") || []

  const incident = incidents.find((i) => i.id === incidentId)
  if (!incident) throw new Error("Incidencia no encontrada")

  const route = routes.find((r: any) => r.id === incident.rutaId)
  if (!route) throw new Error("Ruta no encontrada")

  const assignment = assignments.find(
    (a: any) => a.id === route.asignacionId
  )
  if (!assignment) throw new Error("Asignación no encontrada")

  const vehicle = vehicles.find(
    (v: any) => v.id === assignment.vehiculoId
  )
  if (!vehicle) throw new Error("Vehículo no encontrado")

  vehicle.estado = newState

  incident.acciones.push({
    id: crypto.randomUUID(),
    tipo: "cambio_estado_vehiculo",
    descripcion: `Vehículo marcado como ${newState}`,
    realizadaPor: "gestor_incidencias",
    fecha: new Date().toISOString()
  })

  addRouteEvent({
    routeId: route.id,
    tipo: "estado_vehiculo_actualizado",
    descripcion: `Vehículo marcado como ${newState}`,
    metadata: {
      incidentId: incident.id,
      newState
    }
  })

  saveIncidents(incidents)
  saveData("vehiculos", vehicles)

  return vehicle
}