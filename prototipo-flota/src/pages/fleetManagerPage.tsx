import { useState } from "react"

import {
  getCurrentSession
} from "../services/selectors/sessionSelector"

import {
  getActiveWorks,
  getAvailableResourcesByBranch
} from "../services/selectors/fleetSelector"

import {
  createAssignment
} from "../services/assignmentService"


function FleetManagerPage() {

  const session =
    getCurrentSession()


  const works =
    getActiveWorks()


  const resources =
    getAvailableResourcesByBranch(
      session.branchId
    )


  const [selectedWorkId,
    setSelectedWorkId] =
      useState(null)

  const [selectedVehicleId,
    setSelectedVehicleId] =
      useState(null)

  const [selectedDriverId,
    setSelectedDriverId] =
      useState(null)


  function handleCreateAssignment() {

    try {

      createAssignment({
        trabajoId: selectedWorkId,
        vehiculoId: selectedVehicleId,
        conductorId: selectedDriverId,
        cargaAsignada: 1000
      })


      alert(
        "Asignación creada"
      )

      window.location.reload()

    } catch (error: any) {

      alert(error.message)
    }
  }


  return (
    <div>

      <h1>
        Gestor de Flota
      </h1>


      <h2>
        Trabajos activos
      </h2>


      {
        works.map((work: any) => (

          <div
            key={work.id}
          >
            <h3>
              {work.destino}
            </h3>

            <p>
              Estado:
              {work.estadoOperativo}
            </p>

            <p>
              Carga restante:
              {work.remainingLoad}
            </p>

            <button
              onClick={() =>
                setSelectedWorkId(work.id)
              }
            >
              Seleccionar
            </button>
          </div>
        ))
      }


      <h2>
        Vehículos disponibles
      </h2>


      {
        resources.vehicles.map(
          (vehicle: any) => (

            <button
              key={vehicle.id}

              onClick={() =>
                setSelectedVehicleId(vehicle.id)
              }
            >
              {vehicle.patente}
              -
              {vehicle.capacidadCarga}kg
            </button>
          )
        )
      }


      <h2>
        Conductores disponibles
      </h2>


      {
        resources.drivers.map(
          (driver: any) => (

            <button
              key={driver.id}

              onClick={() =>
                setSelectedDriverId(driver.id)
              }
            >
              {driver.nombre}
            </button>
          )
        )
      }


      <button
        onClick={handleCreateAssignment}
      >
        Crear asignación
      </button>

    </div>
  )
}


export default FleetManagerPage