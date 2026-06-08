import {
  createBrowserRouter
} from "react-router-dom"

import App from "./App"
import ProtectedRoute from "./components/protectedRoute"

import LoginPage from "./pages/loginPage"
import FleetManagerPage from "./pages/fleetManagerPage"
import DriverPage from "./pages/driverPage"
import IncidenciasList from "./views/gestorIncidencias/incidenciasList"
import CrearSolicitud from "./views/gestorSolicitudes/CrearSolicitud"
import SolicitudesList from "./views/gestorSolicitudes/SolicitudesList"
import UnauthorizedPage from "./pages/unauthorizedPage"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {
        index: true,
        element: <LoginPage />
      },

      {
        path: "/fleet",
        element: <ProtectedRoute allowedRoles={["FLEET_MANAGER"]}>
          <FleetManagerPage />
        </ProtectedRoute>
      },

      {
        path: "/driver",
        element: <ProtectedRoute allowedRoles={["DRIVER"]}>
          <DriverPage />
        </ProtectedRoute>
      },

      {
        path: "/incidents",
        element: <ProtectedRoute allowedRoles={["INCIDENT_MANAGER"]}>
          <IncidenciasList />
        </ProtectedRoute>
      },

      {
        path: "/solicitudes",
        element: <ProtectedRoute allowedRoles={["REQUEST_MANAGER"]}>
          <SolicitudesList />
        </ProtectedRoute>
      },
      
      {
        path: "/solicitudes/crear",
        element: <ProtectedRoute allowedRoles={["REQUEST_MANAGER"]}>
          <CrearSolicitud />
        </ProtectedRoute>
      },

      {
        path: "/unauthorized",
        element: <UnauthorizedPage />
      }
    ]
  }
])