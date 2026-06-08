import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react"

import * as authService
from "../services/authService"

export type UserRole =
  | "ADMIN"
  | "FLEET_MANAGER"
  | "INCIDENT_MANAGER"
  | "REQUEST_MANAGER"
  | "DRIVER"

export interface User {

  id: string

  nombre: string

  email: string

  rol: UserRole

  sucursalId: string | null

  conductorId: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean

  login: (
    email: string,
    password: string
  ) => Promise<User>

  logout: () => void

  isAuthenticated: boolean
}

const AuthContext =
  createContext<AuthContextType | null>(null)

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const isDriver =
    user?.rol === "DRIVER"

  const isFleetManager =
    user?.rol === "FLEET_MANAGER"

  const isIncidentManager =
    user?.rol === "INCIDENT_MANAGER"

  useEffect(() => {

    initializeAuth()

  }, [])


  async function initializeAuth() {

    try {

      const token =
        authService.getToken()

      if (!token) {

        setLoading(false)

        return
      }

      const userData =
        await authService.getMe()

      setUser(userData)

    } catch (error) {

      authService.logout()

      setUser(null)

    } finally {

      setLoading(false)
    }
  }


  async function login(
    email,
    password
  ) {

    const result =
      await authService.login(
        email,
        password
      )

    authService.saveToken(
      result.token
    )

    setUser(
      result.user
    )

    return result.user
  }


  function logout() {

    authService.logout()

    setUser(null)
  }


  const value = {

    user,

    loading,

    login,

    logout,

    isAuthenticated:
      !!user,

    isDriver,

    isFleetManager,

    isIncidentManager
  }


  return (

    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context =
    useContext(AuthContext)

  if (!context) {

    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    )
  }

  return context
}