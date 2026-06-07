import { Request, Response } from "express"
import {
  createRequest,
  approveRequest,
  rejectRequest
} from "../services/requestService"

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
    const { aprobadoPor } = req.body

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
    const { rechazadoPor, motivoRechazo } = req.body

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