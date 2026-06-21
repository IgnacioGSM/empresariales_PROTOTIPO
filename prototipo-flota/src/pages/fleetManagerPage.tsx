import { useEffect, useState }
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


import * as workService from "../services/workService"

import * as fleetService from "../services/fleetService"

import * as assignmentService from "../services/assignmentService"

function FleetManagerPage() {

  const [works, setWorks] =
    useState([])

  const [resources, setResources] =
    useState({
      vehiculos: [],
      conductores: []
    })

  //const [alerts, setAlerts] =
  //  useState([])

  async function loadData() {

    try {

      const [
        worksData,
        resourcesData,
        //alertsData
      ] = await Promise.all([

        workService
          .getActiveWorks(),

        fleetService
          .getResources(),

        //fleetService
        //  .getAlerts()
      ])

      setWorks(
        worksData
      )

      setResources(
        resourcesData
      )

      // setAlerts(
      //   alertsData
      // )
      console.log("Works:", worksData)
      console.log("Resources:", resourcesData)
      //console.log("Alerts:", alertsData)

    } catch (error) {

      console.error(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])


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

  const [
    selectedWorkName,

    setSelectedWorkName
  ] = useState(null)

  const [
    selectedVehicleName,

    setSelectedVehicleName
  ] = useState(null)

  const [
    selectedVehicleLoad,

    setSelectedVehicleLoad
  ] = useState(null)

  const [
    selectedDriverName,

    setSelectedDriverName
  ] = useState(null)

  async function handleCreateAssignment() {

    try {

      if (!selectedWorkId ||
        !selectedVehicleId ||
        !selectedDriverId
      ) {
        alert(
          "Por favor, seleccione un trabajo, un vehículo y un conductor"
        )
        return
      }

      await assignmentService.createAssignment({

        trabajoId:
          selectedWorkId,

        vehiculoId:
          selectedVehicleId,

        conductorId:
          selectedDriverId,

        cargaAsignada: Math.min(
          selectedVehicleLoad || 0)
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
                        {work.solicitud.destino}
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

                        {work.solicitud.cliente}
                      </p>


                      <p>
                        <strong>
                          Carga requerida:
                        </strong>

                        {" "}

                        {
                          work.cargaTotal
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
                        {setSelectedWorkId(
                          work.id
                        )
                        setSelectedWorkName(
                          work.solicitud.destino
                        )}
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
                (resources.vehiculos)?.map(
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
                          vehicle.capacidad
                        }kg

                      </p>


                      <PrimaryButton
                        onClick={() =>
                          {
                            setSelectedVehicleId(
                              vehicle.id
                            );
                            setSelectedVehicleName(
                              vehicle.patente
                            );
                            setSelectedVehicleLoad(
                              vehicle.capacidad
                            );
                          }
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
                (resources.conductores)?.map(
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
                          {
                            setSelectedDriverId(
                              driver.id
                            );
                            setSelectedDriverName(
                              driver.nombre
                            );
                          }
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
                  selectedWorkName ||
                  "No seleccionado"
                }
              </p>


              <p>
                Vehículo:
                {" "}
                {
                  selectedVehicleName ||
                  "No seleccionado"
                }
              </p>


              <p>
                Conductor:
                {" "}
                {
                  selectedDriverName ||
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