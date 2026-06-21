import { Router } from "express"
import {
    getActiveWorksController,
    refreshWorkStateController,
    closeWork,
    closeOverdueWorks,
    reopenWorkController
} from "../controllers/controllerWork.ts"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"

const router = Router()

router.use(authMiddleware)
router.use(authorize("ADMIN", "FLEET_MANAGER"))

router.get("/active", getActiveWorksController)
router.post("/:id/refresh", refreshWorkStateController)
router.post("/:id/close", closeWork)
router.post("/close-overdue", closeOverdueWorks)
router.post("/:id/reopen", reopenWorkController)

export default router