import {useEffect, useState} from "react";
import {getAllRequests, approveRequest, rejectRequest} from "../../data/service/requestService";
import type {Request} from "../../types/requests"; 

export default function SolicitudesList() {
    const [requests, setRequests] = useState<Request[]>([]);

    const loadRequests = () => {
        setRequests(getAllRequests())
    }

    useEffect(() => {
        loadRequests()
    }, [])

    const handleApprove = (id: string) => {
        try {
            approveRequest(id)
            setRequests(getAllRequests())
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            } else {
                alert("Error desconocido")
            }
        }
    }

    const handleReject = (id: string) => {
        try {
            rejectRequest(id)
            setRequests(getAllRequests())
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            } else {
                alert("Error desconocido")
            }
        }
    }
    
    return (
    <div className="p-6 bg-bg min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Lista de Solicitudes
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">
          No hay solicitudes registradas.
        </p>
      ) : (
        <table className="min-w-full border border-gray-300 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Destino</th>
              <th className="border px-4 py-2">Carga</th>
              <th className="border px-4 py-2">Fecha límite</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="border px-4 py-2">{req.id}</td>
                <td className="border px-4 py-2">{req.cliente}</td>
                <td className="border px-4 py-2">{req.destino}</td>
                <td className="border px-4 py-2">
                  {req.cargaRequerida} kg
                </td>
                <td className="border px-4 py-2">
                  {req.fechaLimite}
                </td>

                {/* estado con color */}
                <td className="border px-4 py-2">
                  <span
                    className={
                      req.estado.toLocaleLowerCase() === "pendiente"
                        ? "text-yellow-600"
                        : req.estado.toLocaleLowerCase() === "aprobada"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {req.estado}
                  </span>
                </td>

                <td className="border px-4 py-2 space-x-2">
                  {req.estado.toLocaleLowerCase() === "pendiente" && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Rechazar
                      </button>
                    </>
                  )}

                  {/* listo para el siguiente paso */}
                  {req.estado.toLocaleLowerCase() === "aprobada" && req.trabajoId && (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">
                      Ver trabajo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

