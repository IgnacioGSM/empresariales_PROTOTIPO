import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext"

export default function ProtectedRoute({
  children,
  allowedRoles
}) {

  const {
    user,
    loading
  } = useAuth()

  if (loading) {

    return (
      <div>
        Cargando...
      </div>
    )
  }

  if (!user) {

    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.rol
    )
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    )
  }

  return children
}