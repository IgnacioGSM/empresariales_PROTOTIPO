import { useEffect, useState } from "react"

import {
  getOpenIncidents,
  closeIncident,
  updateVehicleStateFromIncident
} from "../../data/service/incidentService"

import {addIncidentAction} from "../../services/incidentService"

import type { Incident } from "../../data/service/incidentService"

import Navbar from "../../components/ui/Navbar"

export default function IncidenciasList() {

  const [incidents, setIncidents] = useState<Incident[]>([])

  const loadIncidents = () => {
    setIncidents(getOpenIncidents())
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | HANDLERS
  |--------------------------------------------------------------------------
  */

  const handleClose = (id: string) => {
    try {
      closeIncident({
        incidentId: id,
        cerradoPor: "gestor_incidencias"
      })

      loadIncidents()

    } catch (error) {
      if (error instanceof Error) alert(error.message)
    }
  }

  const handleChangeRoute = (id: string) => {
    try {
      addIncidentAction({
        incidentId: id,
        tipo: "cambio_ruta",
        descripcion: "Se indicó cambio de ruta",
        realizadaPor: "gestor_incidencias"
      })

      loadIncidents()

    } catch (error) {
      if (error instanceof Error) alert(error.message)
    }
  }

  const handleReturnToBase = (id: string) => {
    try {
      addIncidentAction({
        incidentId: id,
        tipo: "retorno_sucursal",
        descripcion: "Se ordena retorno a sucursal",
        realizadaPor: "gestor_incidencias"
      })

      loadIncidents()

    } catch (error) {
      if (error instanceof Error) alert(error.message)
    }
  }

  const handleVehicleFailure = (id: string) => {
    try {
      updateVehicleStateFromIncident({
        incidentId: id,
        newState: "Averiado"
      })

      loadIncidents()

    } catch (error) {
      if (error instanceof Error) alert(error.message)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-6 bg-bg min-h-screen">
      <Navbar />

      <h1 className="text-2xl font-bold mb-6">
        Gestión de Incidencias
      </h1>

      {incidents.length === 0 ? (
        <p className="text-gray-600">
          No hay incidencias abiertas
        </p>
      ) : (

        <table className="min-w-full border bg-white">

          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Tipo</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Gravedad</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id}>

                <td className="border px-4 py-2">
                  {inc.id}
                </td>

                <td className="border px-4 py-2">
                  {inc.tipo}
                </td>

                <td className="border px-4 py-2">
                  {inc.descripcion}
                </td>

                <td className="border px-4 py-2">
                  <span className={
                    inc.gravedad === "Alta"
                      ? "text-red-600"
                      : inc.gravedad === "Media"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }>
                    {inc.gravedad}
                  </span>
                </td>

                <td className="border px-4 py-2 space-x-2">

                  <button
                    onClick={() => handleChangeRoute(inc.id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Cambiar ruta
                  </button>

                  <button
                    onClick={() => handleReturnToBase(inc.id)}
                    className="bg-orange-600 text-white px-2 py-1 rounded"
                  >
                    Retorno
                  </button>

                  <button
                    onClick={() => handleVehicleFailure(inc.id)}
                    className="bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    Averiado
                  </button>

                  <button
                    onClick={() => handleClose(inc.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Cerrar
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  )
}