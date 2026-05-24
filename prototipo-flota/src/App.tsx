import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import { initializeStorage } from "./data/storage/initializeStorage"

import SolicitudesList from "./views/gestorSolicitudes/SolicitudesList"
import CrearSolicitud from "./views/gestorSolicitudes/CrearSolicitud"
import IncidenciasList from "./views/gestorIncidencias/incidenciasList"

export default function App() {

  useEffect(() => {
    initializeStorage()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">

        {/* NAVBAR simple */}
        <nav className="bg-primary text-white p-4 flex gap-4">
          <Link to="/solicitudes">Solicitudes</Link>
          <Link to="/crear">Crear Solicitud</Link>
          <Link to="/incidencias">Incidencias</Link>
        </nav>

        {/* CONTENIDO */}
        <div className="p-4">
          <Routes>
            <Route path="/" element={<SolicitudesList />} />
            <Route path="/solicitudes" element={<SolicitudesList />} />
            <Route path="/crear" element={<CrearSolicitud />} />
            <Route path="/incidencias" element={<IncidenciasList />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}