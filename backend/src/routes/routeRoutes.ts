import { Router } from "express"
import {
    createRouteEvent,
    startReturnController,
    completeReturnController
} from "../controllers/controllerRoutes.ts"

const router = Router()

router.post("/event", createRouteEvent)
router.post("/start-return", startReturnController)
router.post("/:id/complete-return", completeReturnController)

export default router