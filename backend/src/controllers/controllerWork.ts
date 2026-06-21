import type { Request, Response } from "express"
import {
    getActiveWorks,
    refreshWorkState,
    finalizeWork,
    finalizeOverdueWorks,
    reopenWork
} from "../services/workService.ts"

export const getActiveWorksController = async (req: Request, res: Response) => {
    try {
        const works = await getActiveWorks()

        res.json(works)
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const refreshWorkStateController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params

        const work = await refreshWorkState(id)

        res.json(work)
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const closeWork = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params

        const work = await finalizeWork(id)

        res.json(work)
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const closeOverdueWorks = async (req: Request, res: Response) => {
    try {
        const result = await finalizeOverdueWorks()

        res.json(result)
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const reopenWorkController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params

        const work = await reopenWork(id)

        res.json(work)
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        })
    }
}