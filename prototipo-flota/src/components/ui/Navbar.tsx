import {

  useNavigate

} from "react-router-dom"

import {

  clearCurrentSession,
  getCurrentSession

} from "../../services//selectors/sessionSelector"

import PrimaryButton from "./PrimaryButton"



function Navbar() {

  const navigate =
    useNavigate()

  const session =
    getCurrentSession()


  function handleLogout() {

    clearCurrentSession()

    navigate("/")
  }


  return (

    <nav
      className="
        bg-slate-900
        text-white
        px-6
        py-4
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h1
          className="
            text-xl
            font-bold
          "
        >
          Gestión de Flota
        </h1>

        <p
          className="
            text-sm
            text-slate-300
          "
        >
          {session.role}
        </p>

      </div>


      <PrimaryButton
        onClick={handleLogout}
      >
        Cambiar perfil
      </PrimaryButton>

    </nav>
  )
}

export default Navbar