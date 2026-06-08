import { Request, Response } from "express"
import {
  createAssignment,
  startAssignment,
  finishAssignment,
  abortAssignment
} from "../services/assignmentService"

/*
|--------------------------------------------------------------------------
| CREATE ASSIGNMENT
|--------------------------------------------------------------------------
*/

export const createAssignmentController = async (
  req: Request,
  res: Response
) => {
  try {

    const result = await createAssignment(req.body)

    res.status(201).json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

/*
|--------------------------------------------------------------------------
| START ASSIGNMENT
|--------------------------------------------------------------------------
*/

export const startAssignmentController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params

    const result = await startAssignment(id)

    res.json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

/*
|--------------------------------------------------------------------------
| FINISH ASSIGNMENT
|--------------------------------------------------------------------------
*/

export const finishAssignmentController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params
    const { resultado, cargaEntregada } = req.body

    const result = await finishAssignment({
      assignmentId: id,
      resultado,
      cargaEntregada
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
| ABORT ASSIGNMENT
|--------------------------------------------------------------------------
*/

export const abortAssignmentController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params
    const {
      liberarVehiculo,
      liberarConductor,
      estadoVehiculoPosterior
    } = req.body

    const result = await abortAssignment({
      assignmentId: id,
      liberarVehiculo,
      liberarConductor,
      estadoVehiculoPosterior
    })

    res.json(result)

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}