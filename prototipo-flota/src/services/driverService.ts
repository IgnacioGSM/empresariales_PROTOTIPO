const API_URL = "http://localhost:3000"

// helper para manejar respuestas
async function handleResponse(res: Response) {
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "Error en la petición")
  }

  return data
}



/*
|--------------------------------------------------------------------------
| GET DRIVER ASSIGNMENT
|--------------------------------------------------------------------------
| Obtiene la asignación activa del conductor
|
| Necesitas endpoint:
| GET /assignments/driver/:driverId
|
*/

export async function getDriverAssignment(driverId: string) {
  const res = await fetch(`${API_URL}/assignments/driver/${driverId}`)

  return handleResponse(res)
}

export async function getDriverDashboard(driverId: string) {
  const res = await fetch(`http://localhost:3000/driver/${driverId}`)
  return res.json()
}


/*
|--------------------------------------------------------------------------
| START ASSIGNMENT
|--------------------------------------------------------------------------
| Inicia la ruta (crea Ruta + cambia estados)
|
| POST /assignments/start
|
*/

export async function startAssignment(assignmentId: string) {
  const res = await fetch(`${API_URL}/assignments/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ assignmentId })
  })

  return handleResponse(res)
}






/*
|--------------------------------------------------------------------------
| START RETURN
|--------------------------------------------------------------------------
| Inicia retorno a sucursal
|
| POST /routes/start-return
|
*/

export async function startReturn(data: {
  assignmentId: string
  resultado: string
  cargaEntregada: number
}) {
  const res = await fetch(`${API_URL}/routes/start-return`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  return handleResponse(res)
}






/*
|--------------------------------------------------------------------------
| COMPLETE RETURN
|--------------------------------------------------------------------------
| Finaliza ruta y libera recursos
|
| POST /routes/:id/complete-return
|
*/

export async function completeReturn(routeId: string) {
  const res = await fetch(`${API_URL}/routes/${routeId}/complete-return`, {
    method: "POST"
  })

  return handleResponse(res)
}






/*
|--------------------------------------------------------------------------
| ADD ROUTE EVENT
|--------------------------------------------------------------------------
| Reportar incidencia o evento
|
| POST /routes/event
|
*/

export async function addRouteEvent(data: {
  routeId: string
  tipo: string
  descripcion: string
  metadata?: any
}) {
  const res = await fetch(`${API_URL}/routes/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  return handleResponse(res)
}