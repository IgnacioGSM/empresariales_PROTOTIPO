import { Request, Response } from "express"

import {
    addRouteEvent,
    startReturn,
    completeReturn
} from "../services/routeService"

export const createRouteEvent = async (req: Request, res: Response) => {
    try {
        const { routeId, tipo, descripcion, metadata } = req.body

        const event = await  addRouteEvent({
            routeId,
            tipo,
            descripcion,
            metadata
        })

        res.json(event)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
}

export const startReturnController = async (req: Request, res: Response) => {
    try {
        const { assignmentId, resultado, cargaEntregada} = req.body

        const result = await startReturn({
            assignmentId,
            resultado,
            cargaEntregada
        })

        res.json(result)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
}