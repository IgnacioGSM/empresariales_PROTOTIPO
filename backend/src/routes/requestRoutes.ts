import { Router } from "express"
import {
  createRequestController,
  approveRequestController,
  rejectRequestController
} from "../controller/controllerRequest"

const router = Router()

router.post("/", createRequestController)
router.post("/:id/approve", approveRequestController)
router.post("/:id/reject", rejectRequestController)

export default router