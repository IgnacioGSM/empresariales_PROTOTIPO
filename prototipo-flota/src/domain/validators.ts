import {
  VEHICLE_STATES,
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "./states"

export function canAssignVehicle(vehicle: any) {

  return (
    vehicle.estado === VEHICLE_STATES.AVAILABLE &&
    vehicle.documentacionVigente &&
    vehicle.mantencionVigente
  )
}

export function canAssignDriver(driver: any) {

  return (
    driver.estado === DRIVER_STATES.AVAILABLE &&
    driver.licenciaVigente &&
    driver.aptoMedicamente
  )
}

export function vehicleSupportsLoad(
  vehicle: any,
  requiredLoad: number
) {

  return vehicle.capacidadCarga >= requiredLoad
}

export function canStartAssignment(
  assignment: any,
  vehicle: any,
  driver: any
) {

  return (
    assignment.estadoOperativo ===
      ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED &&

    vehicle.estado === VEHICLE_STATES.ASSIGNED &&

    driver.estado === DRIVER_STATES.ASSIGNED
  )
}

export function canFinishAssignment(
  assignment: any
) {

  return (
    assignment.estadoOperativo ===
      ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
  )
}

export function canAbortAssignment(
  assignment: any
) {

  return (
    assignment.estadoOperativo ===
      ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED
  )
}

export function canSetAssignmentResult(
  assignment: any
) {

  return (
    assignment.estadoOperativo ===
      ASSIGNMENT_OPERATIONAL_STATES.FINISHED
  )
}