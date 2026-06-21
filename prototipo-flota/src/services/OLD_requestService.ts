import {
  getData,
  saveData
} from "../data/storage/localStorage"

import {
  WORK_OPERATIONAL_STATES
} from "../../../backend/domain/states"



/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getRequests() {

  return getData(
    "solicitudes"
  )
}

function saveRequests(
  requests: any[]
) {

  saveData(
    "solicitudes",
    requests
  )
}

function generateId(prefix: string) {

  return `${prefix}-${crypto.randomUUID()}`
}



/*
|--------------------------------------------------------------------------
| CREATE REQUEST
|--------------------------------------------------------------------------
|
| Crea una solicitud de trabajo.
|
| IMPORTANTE:
| - NO crea automáticamente un Trabajo
| - queda pendiente de aprobación
|
*/

export function createRequest({

  cliente,

  destino,

  capacidadCargaNecesaria,

  fechaLimiteEntrega,

  descripcion = ""
}: {
  cliente: string;
  destino: string;
  capacidadCargaNecesaria: number;
  fechaLimiteEntrega: string;
  descripcion?: string;
}) {

  const requests =
    getRequests()


  const request = {

    id: generateId("sol"),


    estado: "Pendiente",


    cliente,

    destino,

    capacidadCargaNecesaria,

    fechaLimiteEntrega,

    descripcion,


    fechaCreacion:
      new Date().toISOString(),


    fechaAprobacion: null,

    aprobadoPor: null,


    fechaRechazo: null,

    rechazadoPor: null,

    motivoRechazo: null,


    trabajoId: null
  }


  requests.push(request)


  saveRequests(requests)


  return request
}



/*
|--------------------------------------------------------------------------
| APPROVE REQUEST
|--------------------------------------------------------------------------
|
| Aprobar solicitud:
| - cambia estado
| - crea Trabajo
|
*/

export function approveRequest({

  requestId,

  aprobadoPor
}: {
  requestId: string;
  aprobadoPor: string;
}) {

  const requests =
    getRequests()

  const works =
    getData("trabajos")


  const request =
    requests.find(
      (item: any) => item.id === requestId
    )

  if (!request) {

    throw new Error(
      "Solicitud no encontrada"
    )
  }


  if (
    request.estado !==
    "Pendiente"
  ) {

    throw new Error(
      "Solo solicitudes pendientes pueden aprobarse"
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Aprobar solicitud
  |--------------------------------------------------------------------------
  */

  request.estado =
    "Aprobada"

  request.fechaAprobacion =
    new Date().toISOString()

  request.aprobadoPor =
    aprobadoPor


  /*
  |--------------------------------------------------------------------------
  | Crear trabajo
  |--------------------------------------------------------------------------
  */

  const workId =
    generateId("trab")


  const work = {

    id: workId,


    solicitudId:
      request.id,


    estadoOperativo:
      WORK_OPERATIONAL_STATES.PENDING,


    resultado: null,


    cliente:
      request.cliente,

    destino:
      request.destino,


    fechaLimite:
      request.fechaLimiteEntrega,


    cargaTotalRequerida:
      request.capacidadCargaNecesaria,

    cargaEntregada: 0,


    asignacionesIds: [],


    fechaCreacion:
      new Date().toISOString(),

    fechaActualizacion:
      new Date().toISOString(),


    fechaFinalizacion: null,

    cerradoPor: null
  }


  works.push(work)


  /*
  |--------------------------------------------------------------------------
  | Enlazar solicitud con trabajo
  |--------------------------------------------------------------------------
  */

  request.trabajoId =
    workId


  saveRequests(requests)

  saveData(
    "trabajos",
    works
  )


  return {
    request,
    work
  }
}



/*
|--------------------------------------------------------------------------
| REJECT REQUEST
|--------------------------------------------------------------------------
|
| Rechaza una solicitud pendiente.
|
*/

export function rejectRequest({

  requestId,

  rechazadoPor,

  motivoRechazo
}: {
  requestId: string;
  rechazadoPor: string;
  motivoRechazo: string;
}) {

  const requests =
    getRequests()


  const request =
    requests.find(
      (item: any) => item.id === requestId
    )

  if (!request) {

    throw new Error(
      "Solicitud no encontrada"
    )
  }


  if (
    request.estado !==
    "Pendiente"
  ) {

    throw new Error(
      "Solo solicitudes pendientes pueden rechazarse"
    )
  }


  request.estado =
    "Rechazada"

  request.fechaRechazo =
    new Date().toISOString()

  request.rechazadoPor =
    rechazadoPor

  request.motivoRechazo =
    motivoRechazo


  saveRequests(requests)


  return request
}