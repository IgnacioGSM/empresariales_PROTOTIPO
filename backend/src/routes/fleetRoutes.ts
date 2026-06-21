import { Router } from "express"
import { getAvailableResourcesByBranchController } from "../controllers/controllerFleet.ts"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"

const router = Router()

router.use(authMiddleware)
router.use(authorize("ADMIN", "FLEET_MANAGER"))

router.get("/resources", getAvailableResourcesByBranchController)

export default router