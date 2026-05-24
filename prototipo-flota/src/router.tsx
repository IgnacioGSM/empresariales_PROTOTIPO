import {
  createBrowserRouter
} from "react-router-dom"

import App from "./App"

import LoginPage from "./pages/loginPage"
import FleetManagerPage from "./pages/fleetManagerPage"
import DriverPage from "./pages/driverPage"
import IncidentManagerPage from "./pages/incidentManagerPage"
import CrearSolicitud from "./views/gestorSolicitudes/CrearSolicitud"
import SolicitudesList from "./views/gestorSolicitudes/SolicitudesList"


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
        element: <FleetManagerPage />
      },

      {
        path: "/driver",
        element: <DriverPage />
      },

      {
        path: "/incidents",
        element: <IncidentManagerPage />
      },

      {
        path: "/solicitudes",
        element: <SolicitudesList />
      },
      
      {
        path: "/solicitudes/crear",
        element: <CrearSolicitud />
      }
    ]
  }
])