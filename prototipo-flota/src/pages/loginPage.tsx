import { useNavigate } from "react-router-dom"

import {
  DEMO_SESSIONS
} from "../mock/demoSessions"

import {
  setCurrentSession
} from "../services/selectors/sessionSelector"

function LoginPage() {

  const navigate = useNavigate()


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
  }


  return (
    <div>

      <h1>
        Gestión de Flota
      </h1>

      <h2>
        Seleccionar perfil
      </h2>


      {
        DEMO_SESSIONS.map(
          session => (
            <button
              key={session.label}

              onClick={() =>
                handleSelect(session)
              }
            >
              {session.label}
            </button>
          )
        )
      }

    </div>
  )
}


export default LoginPage