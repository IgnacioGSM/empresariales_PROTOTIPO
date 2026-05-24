import {
  getCurrentSession
} from "../services/selectors/sessionSelector"

import {
  getDriverDashboard
} from "../services/selectors/driverSelector"

import {
  startAssignment
} from "../services/assignmentService"

import {
  startReturn,
  completeReturn
} from "../services/routeService"


function DriverPage() {

  const session =
    getCurrentSession()


  const dashboard =
    getDriverDashboard(
      session.userId
    )


  function handleAction(action: string) {

    try {

      if (
        action === "start_route"
      ) {

        startAssignment(
          dashboard.assignment.id
        )
      }


      if (
        action === "finish_delivery"
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


      if (
        action === "complete_return"
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
    <div>

      <h1>
        Panel Conductor
      </h1>


      <h2>
        Estado:
        {dashboard.estado}
      </h2>


      {
        !dashboard.assignment && (
          <p>
            No tienes trabajos asignados.
          </p>
        )
      }


      {
        dashboard.assignment && (
          <div>

            <h3>
              Trabajo actual
            </h3>

            <p>
              Destino:
              {dashboard.work.destino}
            </p>

            <p>
              Cliente:
              {dashboard.work.cliente}
            </p>


            {
              dashboard.route && (
                <>
                  <p>
                    Estado ruta:
                    {dashboard.route.estado}
                  </p>

                  <p>
                    Eventos:
                    {
                      dashboard.route.eventos.length
                    }
                  </p>
                </>
              )
            }


            <div>

              {
                dashboard.availableActions.map(
                  action => (
                    <button
                      key={action}

                      onClick={() =>
                        handleAction(action)
                      }
                    >
                      {action}
                    </button>
                  )
                )
              }

            </div>

          </div>
        )
      }

    </div>
  )
}


export default DriverPage