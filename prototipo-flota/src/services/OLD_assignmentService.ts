import {
  getData,
  saveData
} from "../data/storage/localStorage"

import {
  VEHICLE_STATES,
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "../../../backend/domain/states"

import {
  canAssignVehicle,
  canAssignDriver,
  vehicleSupportsLoad,
  canStartAssignment,
  canFinishAssignment,
  canAbortAssignment
} from "../../../backend/domain/validators"

import {
  refreshWorkState
} from "./OLD_workService"



/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function generateId(prefix: string) {

  return `${prefix}-${crypto.randomUUID()}`
}

function getAssignments() {

  return getData("asignaciones")
}

function saveAssignments(assignments: any[]) {

  saveData("asignaciones", assignments)
}



/*
|--------------------------------------------------------------------------
| CREATE ASSIGNMENT
|--------------------------------------------------------------------------
|
| Crea una nueva asignación:
| - valida conductor
| - valida vehículo
| - valida capacidad de carga
| - cambia estados
| - enlaza entidades
|
*/

export function createAssignment({
  trabajoId,
  vehiculoId,
  conductorId,
  cargaAsignada,
  rutaPlanificada
} : {
  trabajoId: string | null;
  vehiculoId: string | null;
  conductorId: string | null;
  cargaAsignada: number;
  rutaPlanificada?: string;
}) {

  const trabajos = getData("trabajos")
  const vehiculos = getData("vehiculos")
  const conductores = getData("conductores")
  const asignaciones = getAssignments()


  const trabajo = trabajos.find(
    (work: any) => work.id === trabajoId
  )

  if (!trabajo) {
    throw new Error("Trabajo no encontrado")
  }


  const vehiculo = vehiculos.find(
    (vehicle: any) => vehicle.id === vehiculoId
  )

  if (!vehiculo) {
    throw new Error("Vehículo no encontrado")
  }


  const conductor = conductores.find(
    (driver: any) => driver.id === conductorId
  )

  if (!conductor) {
    throw new Error("Conductor no encontrado")
  }


  if (!canAssignVehicle(vehiculo)) {

    throw new Error(
      "Vehículo no disponible para asignación"
    )
  }


  if (!canAssignDriver(conductor)) {

    throw new Error(
      "Conductor no disponible para asignación"
    )
  }


  if (
    !vehicleSupportsLoad(
      vehiculo,
      cargaAsignada
    )
  ) {

    throw new Error(
      "Vehículo no soporta la carga requerida"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | WARNING DE SOBRECARGA GLOBAL
  |--------------------------------------------------------------------------
  |
  | No bloquea la creación.
  | Solo informa que la suma de cargas asignadas
  | supera la carga requerida del trabajo.
  |
  */

  const relatedAssignments = asignaciones.filter(
    (assignment: any) =>
      assignment.trabajoId === trabajoId
  )

  const alreadyAssignedLoad =
    relatedAssignments.reduce(
      (total: number, assignment: any) =>
        total + assignment.cargaAsignada,
      0
    )

  const projectedAssignedLoad =
    alreadyAssignedLoad + cargaAsignada

  const warnings = []

  if (
    projectedAssignedLoad >
    trabajo.cargaTotalRequerida
  ) {

    warnings.push(
      "La carga asignada total supera la carga requerida del trabajo"
    )
  }


  const assignmentId = generateId("asig")


  const assignment = {

    id: assignmentId,

    trabajoId,

    vehiculoId,
    conductorId,

    estadoOperativo:
      ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED,

    resultado: null,

    cargaAsignada,
    cargaEntregada: 0,

    rutaPlanificada,

    rutaRealId: null,

    fechaCreacion:
      new Date().toISOString()
  }


  asignaciones.push(assignment)


  trabajo.asignacionesIds.push(
    assignmentId
  )


  vehiculo.estado =
    VEHICLE_STATES.ASSIGNED

  vehiculo.asignacionActivaId =
    assignmentId


  conductor.estado =
    DRIVER_STATES.ASSIGNED

  conductor.asignacionActivaId =
    assignmentId


  saveAssignments(asignaciones)

  saveData("trabajos", trabajos)

  saveData("vehiculos", vehiculos)

  saveData("conductores", conductores)


  refreshWorkState(trabajoId)


  return {
    assignment,
    warnings
  }
}



/*
|--------------------------------------------------------------------------
| START ASSIGNMENT
|--------------------------------------------------------------------------
|
| - activa asignación
| - crea ruta real
| - cambia estados operativos
|
*/

export function startAssignment(
  assignmentId: string
) {

  const asignaciones = getAssignments()
  const vehiculos = getData("vehiculos")
  const conductores = getData("conductores")
  const rutas = getData("rutas")


  const assignment = asignaciones.find(
    (item: any) => item.id === assignmentId
  )

  if (!assignment) {
    throw new Error("Asignación no encontrada")
  }


  const vehiculo = vehiculos.find(
    (vehicle: any) =>
      vehicle.id === assignment.vehiculoId
  )

  if (!vehiculo) {
    throw new Error("Vehículo no encontrado")
  }

  const conductor = conductores.find(
    (driver: any) =>
      driver.id === assignment.conductorId
  )

    if (!conductor) {
    throw new Error("Conductor no encontrado")
  }


  if (
    !canStartAssignment(
      assignment,
      vehiculo,
      conductor
    )
  ) {

    throw new Error(
      "La asignación no puede iniciar"
    )
  }


  assignment.estadoOperativo =
    ASSIGNMENT_OPERATIONAL_STATES.ACTIVE


  vehiculo.estado =
    VEHICLE_STATES.IN_ROUTE


  conductor.estado =
    DRIVER_STATES.IN_ROUTE


  const routeId = generateId("ruta")


  const route = {
    id: routeId,

    asignacionId: assignment.id,

    horaInicio:
      new Date().toISOString(),

    horaFin: null,

    estado: "Activa",

    eventos: [],

    incidenciasIds: []
  }


  rutas.push(route)


  assignment.rutaRealId = routeId


  saveAssignments(asignaciones)

  saveData("vehiculos", vehiculos)
  saveData("conductores", conductores)
  saveData("rutas", rutas)


  refreshWorkState(
    assignment.trabajoId
  )


  return assignment
}



/*
|--------------------------------------------------------------------------
| FINISH ASSIGNMENT
|--------------------------------------------------------------------------
|
| IMPORTANTE:
| - NO finaliza automáticamente el Trabajo
| - solo actualiza progreso
| por ahora no se usa esta funcion, el cierre se hace desde el comienzo del retorno de ruta
|
*/

export function finishAssignment({
  assignmentId,
  resultado,
  cargaEntregada
} : {
  assignmentId: string;
  resultado: string;
  cargaEntregada: number;
}) {

  const asignaciones = getAssignments()
  const rutas = getData("rutas")


  const assignment = asignaciones.find(
    (item: any) => item.id === assignmentId
  )

  if (!assignment) {
    throw new Error("Asignación no encontrada")
  }


  if (!canFinishAssignment(assignment)) {
    throw new Error(
      "La asignación no puede finalizar"
    )
  }


  assignment.estadoOperativo =
    ASSIGNMENT_OPERATIONAL_STATES.FINISHED

  assignment.resultado = resultado

  assignment.cargaEntregada = cargaEntregada


  const route = rutas.find(
    (route: any) =>
      route.id === assignment.rutaRealId
  )


  if (route) {

    route.horaFin =
      new Date().toISOString()
  }


  saveAssignments(asignaciones)
  saveData("rutas", rutas)


  refreshWorkState(
    assignment.trabajoId
  )


  return assignment
}



/*
|--------------------------------------------------------------------------
| ABORT ASSIGNMENT
|--------------------------------------------------------------------------
*/

export function abortAssignment({
  assignmentId,
  liberarVehiculo = false,
  liberarConductor = true,
  estadoVehiculoPosterior = null
} : {
  assignmentId: string;
  liberarVehiculo: boolean;
  liberarConductor: boolean;
  estadoVehiculoPosterior: string | null;
}) {

  const asignaciones = getAssignments()
  const vehiculos = getData("vehiculos")
  const conductores = getData("conductores")


  const assignment = asignaciones.find(
    (item: any) => item.id === assignmentId
  )

  if (!assignment) {
    throw new Error("Asignación no encontrada")
  }


  if (!canAbortAssignment(assignment)) {
    throw new Error(
      "La asignación no puede abortarse"
    )
  }


  assignment.estadoOperativo =
    ASSIGNMENT_OPERATIONAL_STATES.ABORTED


  const vehiculo = vehiculos.find(
    (vehicle: any) =>
      vehicle.id === assignment.vehiculoId
  )

  const conductor = conductores.find(
    (driver: any) =>
      driver.id === assignment.conductorId
  )


  if (liberarVehiculo) {

    vehiculo.estado =
      estadoVehiculoPosterior ||
      VEHICLE_STATES.AVAILABLE

    vehiculo.asignacionActivaId = null
  }


  if (liberarConductor) {

    conductor.estado =
      DRIVER_STATES.AVAILABLE

    conductor.asignacionActivaId = null
  }


  saveAssignments(asignaciones)

  saveData("vehiculos", vehiculos)
  saveData("conductores", conductores)


  refreshWorkState(
    assignment.trabajoId
  )


  return assignment
}