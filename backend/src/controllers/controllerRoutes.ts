import type { Request, Response } from "express"

import {
    addRouteEvent,
    startReturn,
    completeReturn
} from "../services/routeService.ts"

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

export const completeReturnController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params

        const route = await completeReturn(id)

        res.json(route)
    } catch (error: any) {
        res.status(400).json({ error: error.message})
    }
}