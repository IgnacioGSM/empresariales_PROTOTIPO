import { Router } from "express"
import {
  createAssignmentController,
  startAssignmentController,
  finishAssignmentController,
  abortAssignmentController
} from "../controllers/controllerAssignment.ts"

const router = Router()

// crear asignación
router.post("/", createAssignmentController)

// iniciar asignación
router.post("/:id/start", startAssignmentController)

// finalizar asignación
router.post("/:id/finish", finishAssignmentController)

// abortar asignación
router.post("/:id/abort", abortAssignmentController)

export default router