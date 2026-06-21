import type { Request, Response } from "express"
import {
  getAllRequests,
  getRequestById,
  createRequest,
  approveRequest,
  rejectRequest
} from "../services/requestService.ts"


/*|--------------------------------------------------------------------------
| GET ALL REQUESTS
|--------------------------------------------------------------------------
*/

export const getAllRequestsController = async (
  req: Request,
  res: Response
) => {
  try {

    const result = await getAllRequests()

    res.json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

/*|--------------------------------------------------------------------------
| GET REQUEST BY ID
|--------------------------------------------------------------------------
*/

export const getRequestByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params

    const result = await getRequestById(id)

    if (!result) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      })
    }

    res.json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

/*
|--------------------------------------------------------------------------
| CREATE REQUEST
|--------------------------------------------------------------------------
*/

export const createRequestController = async (
  req: Request,
  res: Response
) => {
  try {

    const result = await createRequest(req.body)

    res.status(201).json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

/*
|--------------------------------------------------------------------------
| APPROVE REQUEST
|--------------------------------------------------------------------------
*/

export const approveRequestController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params
    
    const aprobadoPor = req.user?.userId

    if (!aprobadoPor) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      })
    }

    const result = await approveRequest({
      requestId: id,
      aprobadoPor
    })

    res.json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

/*
|--------------------------------------------------------------------------
| REJECT REQUEST
|--------------------------------------------------------------------------
*/

export const rejectRequestController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params

    const rechazadoPor = req.user?.userId

    if (!rechazadoPor) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      })
    }

    const motivoRechazo = req.body.motivoRechazo

    const result = await rejectRequest({
      requestId: id,
      rechazadoPor,
      motivoRechazo
    })

    res.json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}