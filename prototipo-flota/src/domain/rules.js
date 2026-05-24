import {
  WORK_STATES,
  ASSIGNMENT_STATES
} from "./states"

export function calculateDeliveredLoad(
  assignments
) {

  let delivered = 0

  for (const assignment of assignments) {

    if (
      assignment.resultado === ASSIGNMENT_STATES.COMPLETED ||
      assignment.resultado === ASSIGNMENT_STATES.PARTIAL
    ) {

      delivered += assignment.cargaAsignada
    }
  }

  return delivered
}

export function hasActiveAssignments(
  assignments
) {

  return assignments.some(
    assignment =>
      assignment.estadoOperativo === ASSIGNMENT_STATES.ACTIVE
  )
}

export function hasConfirmedAssignments(
  assignments
) {

  return assignments.some(
    assignment =>
      assignment.estadoOperativo === ASSIGNMENT_STATES.CONFIRMED
  )
}

export function allAssignmentsCompleted(
  assignments
) {

  return assignments.every(
    assignment =>
      assignment.estadoOperativo === ASSIGNMENT_STATES.COMPLETED
  )
}

export function hasPartialAssignments(
  assignments
) {

  return assignments.some(
    assignment =>
      assignment.estadoOperativo === ASSIGNMENT_STATES.PARTIAL
  )
}

export function allAssignmentsAborted(
  assignments
) {

  return assignments.every(
    assignment =>
      assignment.estadoOperativo === ASSIGNMENT_STATES.ABORTED
  )
}

export function calculateWorkState(
  assignments
) {

  if (!assignments.length) {
    return WORK_STATES.PENDING
  }

  if (hasActiveAssignments(assignments)) {
    return WORK_STATES.IN_PROGRESS
  }

  if (hasConfirmedAssignments(assignments)) {
    return WORK_STATES.ASSIGNED
  }

  if (allAssignmentsCompleted(assignments)) {
    return WORK_STATES.COMPLETED
  }

  if (hasPartialAssignments(assignments)) {
    return WORK_STATES.PARTIAL
  }

  if (allAssignmentsAborted(assignments)) {
    return WORK_STATES.FAILED
  }

  return WORK_STATES.PENDING
}