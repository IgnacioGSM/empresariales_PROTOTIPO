import type { Request, Response } from "express"
import {
    getAvailableResourcesByBranch
} from "../services/fleetService.ts"

export const getAvailableResourcesByBranchController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId
        
        if (!userId) {
            return res.status(401).json({
                error: "Usuario no autenticado"
            })
        }

        const resources = await getAvailableResourcesByBranch(userId)

        res.json(resources)
    } catch (error: any) {
        res.status(400).json({
            error: error.message
        })
    }
}