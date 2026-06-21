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
  getDriverDashboard
}
from "../services/selectors/driverSelector"

import {
  startAssignment
}
from "../services/OLD_assignmentService"

import {
  startReturn,
  completeReturn
}
from "../services/routeService"



function DriverPage() {

  const session =
    getCurrentSession()


  const dashboard =
    getDriverDashboard(
      session.userId
    )


  function handleAction(action: string) {

    try {

      /*
      |--------------------------------------------------------------------------
      | Iniciar ruta
      |--------------------------------------------------------------------------
      */

      if (
        action ===
        "start_route"
      ) {

        startAssignment(
          dashboard.assignment.id
        )
      }


      /*
      |--------------------------------------------------------------------------
      | Finalizar entrega
      |--------------------------------------------------------------------------
      */

      if (
        action ===
        "finish_delivery"
      ) {

        startReturn({

          assignmentId:
            dashboard.assignment.id,

          resultado:
            "Exitosa",

          cargaEntregada:
            dashboard.assignment.cargaAsignada
        })
      }


      /*
      |--------------------------------------------------------------------------
      | Completar retorno
      |--------------------------------------------------------------------------
      */

      if (
        action ===
        "complete_return"
      ) {

        completeReturn(
          dashboard.route.id
        )
      }


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
          max-w-6xl
          mx-auto
          p-6
        "
      >

        <SectionTitle>
          Panel Conductor
        </SectionTitle>


        <div
          className="
            grid
            gap-6
          "
        >

          {/* Estado actual */}

          <Card>

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    mb-2
                  "
                >
                  Estado actual
                </h2>

                <p
                  className="
                    text-slate-500
                  "
                >
                  {dashboard.driver.nombre}
                </p>

              </div>


              <StatusBadge
                status={dashboard.estado}
              />

            </div>

          </Card>


          {/* Sin asignación */}

          {
            !dashboard.assignment && (

              <Card>

                <p
                  className="
                    text-slate-600
                  "
                >
                  No tienes trabajos asignados actualmente.
                </p>

              </Card>
            )
          }


          {/* Trabajo actual */}

          {
            dashboard.assignment && (

              <>
                <Card>

                  <div
                    className="
                      flex
                      justify-between
                      items-start
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-xl
                          font-bold
                          mb-4
                        "
                      >
                        Trabajo actual
                      </h2>


                      <div
                        className="
                          space-y-2
                        "
                      >

                        <p>
                          <strong>
                            Cliente:
                          </strong>

                          {" "}

                          {dashboard.work.cliente}
                        </p>


                        <p>
                          <strong>
                            Destino:
                          </strong>

                          {" "}

                          {dashboard.work.destino}
                        </p>


                        <p>
                          <strong>
                            Fecha límite:
                          </strong>

                          {" "}

                          {
                            dashboard.work.fechaLimite
                          }
                        </p>

                      </div>

                    </div>


                    <StatusBadge
                      status={
                        dashboard.assignment
                          .estadoOperativo
                      }
                    />

                  </div>

                </Card>


                {/* Ruta */}

                {
                  dashboard.route && (

                    <Card>

                      <h2
                        className="
                          text-xl
                          font-bold
                          mb-4
                        "
                      >
                        Ruta
                      </h2>


                      <div
                        className="
                          space-y-2
                        "
                      >

                        <p>
                          <strong>
                            Estado:
                          </strong>

                          {" "}

                          {
                            dashboard.route.estado
                          }
                        </p>


                        <p>
                          <strong>
                            Eventos:
                          </strong>

                          {" "}

                          {
                            dashboard.route.eventos.length
                          }
                        </p>


                        <p>
                          <strong>
                            Incidencias:
                          </strong>

                          {" "}

                          {
                            dashboard.incidents.length
                          }
                        </p>

                      </div>

                    </Card>
                  )
                }


                {/* Acciones */}

                <Card>

                  <h2
                    className="
                      text-xl
                      font-bold
                      mb-4
                    "
                  >
                    Acciones disponibles
                  </h2>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-4
                    "
                  >

                    {
                      dashboard.availableActions.map(
                        action => (

                          <PrimaryButton
                            key={action}

                            onClick={() =>
                              handleAction(action)
                            }
                          >
                            {action}
                          </PrimaryButton>
                        )
                      )
                    }

                  </div>

                </Card>
              </>
            )
          }

        </div>

      </div>
    </>
  )
}


export default DriverPage