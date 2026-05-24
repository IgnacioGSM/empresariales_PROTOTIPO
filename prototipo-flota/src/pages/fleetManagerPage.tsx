import { useState }
from "react"

import Navbar
from "../components/ui/Navbar"

import Card
from "../components/ui/Card"

import StatusBadge
from "../components/ui/StatusBadge"

import SectionTitle
from "../components/ui/SectionTitle"

import PrimaryButton
from "../components/ui/PrimaryButton"

import {
  getCurrentSession
}
from "../services/selectors/sessionSelector"

import {
  getActiveWorks,
  getAvailableResourcesByBranch
}
from "../services/selectors/fleetSelector"

import {
  createAssignment
}
from "../services/assignmentService"



function FleetManagerPage() {

  const session =
    getCurrentSession()


  const works =
    getActiveWorks()


  const resources =
    getAvailableResourcesByBranch(
      session.branchId
    )


  const [
    selectedWorkId,

    setSelectedWorkId

  ] = useState(null)


  const [
    selectedVehicleId,

    setSelectedVehicleId

  ] = useState(null)


  const [
    selectedDriverId,

    setSelectedDriverId

  ] = useState(null)



  function handleCreateAssignment() {

    try {

      createAssignment({

        trabajoId:
          selectedWorkId,

        vehiculoId:
          selectedVehicleId,

        conductorId:
          selectedDriverId,

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

    <>
      <Navbar />

      <div
        className="
          max-w-7xl
          mx-auto
          p-6
        "
      >

        <SectionTitle>
          Gestor de Flota
        </SectionTitle>


        <div
          className="
            grid
            gap-10
          "
        >

          {/* Trabajos */}

          <section>

            <h2
              className="
                text-xl
                font-bold
                mb-4
              "
            >
              Trabajos activos
            </h2>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
              "
            >

              {
                works.map((work: any) => (

                  <Card
                    key={work.id}

                    className={
                      selectedWorkId ===
                      work.id

                        ? `
                          ring-2
                          ring-slate-900
                        `
                        : ""
                    }
                  >

                    <div
                      className="
                        flex
                        justify-between
                        items-start
                        mb-4
                      "
                    >

                      <h3
                        className="
                          text-lg
                          font-bold
                        "
                      >
                        {work.destino}
                      </h3>


                      <StatusBadge
                        status={
                          work.estadoOperativo
                        }
                      />

                    </div>


                    <div
                      className="
                        space-y-2
                        mb-6
                      "
                    >

                      <p>
                        <strong>
                          Cliente:
                        </strong>

                        {" "}

                        {work.cliente}
                      </p>


                      <p>
                        <strong>
                          Carga requerida:
                        </strong>

                        {" "}

                        {
                          work.cargaTotalRequerida
                        }kg
                      </p>


                      <p>
                        <strong>
                          Carga restante:
                        </strong>

                        {" "}

                        {
                          work.remainingLoad
                        }kg
                      </p>

                    </div>


                    <PrimaryButton
                      onClick={() =>
                        setSelectedWorkId(
                          work.id
                        )
                      }
                    >
                      Seleccionar
                    </PrimaryButton>

                  </Card>
                ))
              }

            </div>

          </section>


          {/* Vehículos */}

          <section>

            <h2
              className="
                text-xl
                font-bold
                mb-4
              "
            >
              Vehículos disponibles
            </h2>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
              "
            >

              {
                (resources.vehicles as any[]).map(
                  (vehicle: any) => (

                    <Card
                      key={vehicle.id}

                      className={
                        selectedVehicleId ===
                        vehicle.id

                          ? `
                            ring-2
                            ring-slate-900
                          `
                          : ""
                      }
                    >

                      <div
                        className="
                          flex
                          justify-between
                          items-start
                          mb-4
                        "
                      >

                        <h3
                          className="
                            text-lg
                            font-bold
                          "
                        >
                          {vehicle.patente}
                        </h3>


                        <StatusBadge
                          status={
                            vehicle.estado
                          }
                        />

                      </div>


                      <p className="mb-6">

                        <strong>
                          Capacidad:
                        </strong>

                        {" "}

                        {
                          vehicle.capacidadCarga
                        }kg

                      </p>


                      <PrimaryButton
                        onClick={() =>
                          setSelectedVehicleId(
                            vehicle.id
                          )
                        }
                      >
                        Seleccionar
                      </PrimaryButton>

                    </Card>
                  )
                )
              }

            </div>

          </section>


          {/* Conductores */}

          <section>

            <h2
              className="
                text-xl
                font-bold
                mb-4
              "
            >
              Conductores disponibles
            </h2>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-6
              "
            >

              {
                (resources.drivers as any[]).map(
                  (driver: any) => (

                    <Card
                      key={driver.id}

                      className={
                        selectedDriverId ===
                        driver.id

                          ? `
                            ring-2
                            ring-slate-900
                          `
                          : ""
                      }
                    >

                      <div
                        className="
                          flex
                          justify-between
                          items-start
                          mb-4
                        "
                      >

                        <h3
                          className="
                            text-lg
                            font-bold
                          "
                        >
                          {driver.nombre}
                        </h3>


                        <StatusBadge
                          status={
                            driver.estado
                          }
                        />

                      </div>


                      <PrimaryButton
                        onClick={() =>
                          setSelectedDriverId(
                            driver.id
                          )
                        }
                      >
                        Seleccionar
                      </PrimaryButton>

                    </Card>
                  )
                )
              }

            </div>

          </section>


          {/* Crear asignación */}

          <Card>

            <div
              className="
                flex
                flex-col
                gap-4
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Crear asignación
              </h2>


              <p>
                Trabajo:
                {" "}
                {
                  selectedWorkId ||
                  "No seleccionado"
                }
              </p>


              <p>
                Vehículo:
                {" "}
                {
                  selectedVehicleId ||
                  "No seleccionado"
                }
              </p>


              <p>
                Conductor:
                {" "}
                {
                  selectedDriverId ||
                  "No seleccionado"
                }
              </p>


              <PrimaryButton
                onClick={
                  handleCreateAssignment
                }

                disabled={
                  !selectedWorkId ||
                  !selectedVehicleId ||
                  !selectedDriverId
                }
              >
                Crear asignación
              </PrimaryButton>

            </div>

          </Card>

        </div>

      </div>
    </>
  )
}


export default FleetManagerPage