import { Router } from "express"
import {
  getAllRequestsController,
  getRequestByIdController,
  createRequestController,
  approveRequestController,
  rejectRequestController
} from "../controllers/controllerRequest.ts"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { authorize } from "../middleware/authorize.middleware.js"

const router = Router()

router.use(authMiddleware)
router.use(authorize("ADMIN", "REQUEST_MANAGER"))

router.get("/", getAllRequestsController)
router.get("/:id", getRequestByIdController)
router.post("/", createRequestController)
router.post("/:id/approve", approveRequestController)
router.post("/:id/reject", rejectRequestController)

export default router