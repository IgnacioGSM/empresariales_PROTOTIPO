import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import CrearSolicitud from "./views/gestorSolicitudes/CrearSolicitud"
import SolicitudesList from "./views/gestorSolicitudes/SolicitudesList"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        {/* Barra de navegación */}
        <nav className="bg-primary text-white p-4 flex space-x-4">
          <Link to="/" className="hover:underline">
            Crear Solicitud
          </Link>
          <Link to="/solicitudes" className="hover:underline">
            Lista de Solicitudes
          </Link>
        </nav>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<CrearSolicitud />} />
          <Route path="/solicitudes" element={<SolicitudesList />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
