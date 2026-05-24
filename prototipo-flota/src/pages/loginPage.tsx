import { useNavigate } from "react-router-dom"

import { DEMO_SESSIONS }
from "../mock/demoSessions"

import {
  setCurrentSession
}
from "../services/selectors/sessionSelector"

import Card
from "../components/ui/Card"

import PrimaryButton
from "../components/ui/PrimaryButton"



function LoginPage() {

  const navigate =
    useNavigate()


  function handleSelect(session: any) {

    setCurrentSession(session)


    if (
      session.role ===
      "fleet_manager"
    ) {
      navigate("/fleet")
    }


    if (
      session.role ===
      "driver"
    ) {
      navigate("/driver")
    }


    if (
      session.role ===
      "incident_manager"
    ) {
      navigate("/incidents")
    }
    if (
      session.role ===
      "request_manager"
    ) {
      navigate("/solicitudes/crear")
    }
    if (
      session.role ===
      "listado_solicitudes"
    ) {
      navigate("/solicitudes")
    }
  }


  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-3xl
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            text-center
            mb-2
          "
        >
          Gestión de Flota
        </h1>

        <p
          className="
            text-center
            text-slate-600
            mb-10
          "
        >
          Selecciona un perfil demo
        </p>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {
            DEMO_SESSIONS.map(
              session => (

                <Card
                  key={session.label}
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-xl
                          font-semibold
                        "
                      >
                        {session.label}
                      </h2>

                      <p
                        className="
                          text-slate-500
                          mt-1
                        "
                      >
                        {session.role}
                      </p>

                    </div>


                    <PrimaryButton
                      onClick={() =>
                        handleSelect(session)
                      }
                    >
                      Entrar
                    </PrimaryButton>

                  </div>

                </Card>
              )
            )
          }

        </div>

      </div>

    </div>
  )
}


export default LoginPage