import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../contexts/authContext"

export default function LoginPage() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {

    e.preventDefault()

    setError("")
    setLoading(true)

    try {

      const user =
        await login(
          email,
          password
        )

      redirectByRole(user.rol)

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Error al iniciar sesión"
      )

    } finally {

      setLoading(false)
    }
  }

  function redirectByRole(role) {

    switch (role) {

      case "ADMIN":
        navigate("/admin")
        break

      case "FLEET_MANAGER":
        navigate("/fleet")
        break

      case "INCIDENT_MANAGER":
        navigate("/incidents")
        break

      case "REQUEST_MANAGER":
        navigate("/requests")
        break

      case "DRIVER":
        navigate("/driver")
        break

      default:
        navigate("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Sistema de Gestión de Flota
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="block mb-1 font-medium">
              Correo
            </label>

            <input
              type="email"
              value={email}
              onChange={e =>
                setEmail(e.target.value)
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={e =>
                setPassword(e.target.value)
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>

        </form>

      </div>

    </div>
  )
}