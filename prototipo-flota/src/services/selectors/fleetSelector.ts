import { getData } from "../../data/storage/localStorage"

import {
  VEHICLE_STATES,
  DRIVER_STATES,
  WORK_OPERATIONAL_STATES
} from "../../domain/states"



/*
|--------------------------------------------------------------------------
| GET ACTIVE WORKS
|--------------------------------------------------------------------------
*/

export function getActiveWorks() {

  const works =
    getData("trabajos")

  const assignments =
    getData("asignaciones")


  return works
    .filter(
      (work: any) =>
        work.estadoOperativo !==
        WORK_OPERATIONAL_STATES.FINISHED
    )
    .map((work: any) => {

      const relatedAssignments =
        assignments.filter(
          (assignment: any) =>
            assignment.trabajoId ===
            work.id
        )

      const totalAssignedLoad =
        relatedAssignments.reduce(

          (sum: number, assignment: any) =>
            sum +
            (
              assignment.cargaAsignada || 0
            ),

          0
        )


      return {

        ...work,

        assignmentCount:
          relatedAssignments.length,

        totalAssignedLoad,

        remainingLoad:
          Math.max(
            0,
            work.cargaTotalRequerida -
            totalAssignedLoad
          )
      }
    })
}



/*
|--------------------------------------------------------------------------
| GET AVAILABLE RESOURCES BY BRANCH
|--------------------------------------------------------------------------
*/

export function getAvailableResourcesByBranch(
  branchId: string
) {

  const vehicles =
    getData("vehiculos")

  const drivers =
    getData("conductores")


  const availableVehicles =
    vehicles.filter(
      (vehicle: any) =>

        vehicle.sucursalId ===
          branchId &&

        vehicle.estado ===
          VEHICLE_STATES.AVAILABLE
    )


  const availableDrivers =
    drivers.filter(
      (driver: any) =>

        driver.sucursalId ===
          branchId &&

        driver.estado ===
          DRIVER_STATES.AVAILABLE
    )


  return {

    vehicles:
      availableVehicles,

    drivers:
      availableDrivers
  }
}



/*
|--------------------------------------------------------------------------
| GET COMPATIBLE VEHICLES
|--------------------------------------------------------------------------
*/

export function getCompatibleVehicles(

  branchId: string,

  requiredLoad: number
) {

  const vehicles =
    getData("vehiculos")


  return vehicles.filter(
    (vehicle: any) =>

      vehicle.sucursalId ===
        branchId &&

      vehicle.estado ===
        VEHICLE_STATES.AVAILABLE &&

      vehicle.capacidadCarga >=
        requiredLoad
  )
}



/*
|--------------------------------------------------------------------------
| GET FLEET ALERTS
|--------------------------------------------------------------------------
|
| Alertas simples para demo.
|
*/

export function getFleetAlerts(
  branchId: string
) {

  const incidents =
    getData("incidencias")

  const routes =
    getData("rutas")

  const assignments =
    getData("asignaciones")

  const vehicles =
    getData("vehiculos")


  return incidents
    .filter(
      (incident: any) =>
        incident.estado ===
        "Abierta"
    )
    .map((incident: any) => {

      const route =
        routes.find(
          (item: any) =>
            item.id ===
            incident.rutaId
        )

      const assignment =
        route
          ? assignments.find(
              (item: any) =>
                item.id ===
                route.asignacionId
            )
          : null

      const vehicle =
        assignment
          ? vehicles.find(
              (item: any) =>
                item.id ===
                assignment.vehiculoId
            )
          : null


      return {

        incident,

        route,

        assignment,

        vehicle
      }
    })
    .filter(
      (alert: any) =>

        alert.vehicle?.sucursalId ===
        branchId
    )
}