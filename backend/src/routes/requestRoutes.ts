import { Router } from "express"
import {
  getAllRequestsController,
  getRequestByIdController,
  createRequestController,
  approveRequestController,
  rejectRequestController
} from "../controllers/controllerRequest.ts"

const router = Router()

router.get("/", getAllRequestsController)
router.get("/:id", getRequestByIdController)
router.post("/", createRequestController)
router.post("/:id/approve", approveRequestController)
router.post("/:id/reject", rejectRequestController)

export default router