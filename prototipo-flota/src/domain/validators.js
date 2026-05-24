import {
  VEHICLE_STATES,
  DRIVER_STATES,
  ASSIGNMENT_OPERATIONAL_STATES
} from "./states"

export function canAssignVehicle(vehicle) {

  return (
    vehicle.estado === VEHICLE_STATES.AVAILABLE &&
    vehicle.documentacionVigente &&
    vehicle.mantencionVigente
  )
}

export function canAssignDriver(driver) {

  return (
    driver.estado === DRIVER_STATES.AVAILABLE &&
    driver.licenciaVigente &&
    driver.aptoMedicamente
  )
}

export function vehicleSupportsLoad(
  vehicle,
  requiredLoad
) {

  return vehicle.capacidadCarga >= requiredLoad
}

export function canStartAssignment(
  assignment,
  vehicle,
  driver
) {

  return (
    assignment.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED &&
    vehicle.estado === VEHICLE_STATES.ASSIGNED &&
    driver.estado === DRIVER_STATES.ASSIGNED
  )
}

export function canFinishAssignment(
  assignment
) {

  return (
    assignment.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.ACTIVE
  )
}

export function canAbortAssignment(
  assignment
) {

  return (
    assignment.estadoOperativo === ASSIGNMENT_OPERATIONAL_STATES.CONFIRMED
  )
}