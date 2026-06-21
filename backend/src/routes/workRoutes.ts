import { Router } from "express"
import {
    refreshWorkStateController,
    closeWork,
    closeOverdueWorks,
    reopenWorkController
} from "../controllers/controllerWork.ts"

const router = Router()

router.post("/:id/refresh", refreshWorkStateController)
router.post("/:id/close", closeWork)
router.post("/close-overdue", closeOverdueWorks)
router.post("/:id/reopen", reopenWorkController)

export default router