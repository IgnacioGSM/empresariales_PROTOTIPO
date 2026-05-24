import {
  getData,
  saveData
} from "../../data/storage/localStorage"



/*
|--------------------------------------------------------------------------
| SESSION STORAGE KEY
|--------------------------------------------------------------------------
*/

const SESSION_KEY =
  "currentSession"



/*
|--------------------------------------------------------------------------
| GET CURRENT SESSION
|--------------------------------------------------------------------------
*/

export function getCurrentSession() {

  return (
    getData(SESSION_KEY) ||

    {
      role: null,
      userId: null,
      branchId: null
    }
  )
}



/*
|--------------------------------------------------------------------------
| SET CURRENT SESSION
|--------------------------------------------------------------------------
|
| Para selector simple de rol/usuario.
|
*/

export function setCurrentSession({

  role = null,

  userId = null,

  branchId = null
}) {

  const session = {

    role,

    userId,

    branchId
  }


  saveData(
    SESSION_KEY,
    session
  )


  return session
}



/*
|--------------------------------------------------------------------------
| CLEAR SESSION
|--------------------------------------------------------------------------
*/

export function clearCurrentSession() {

  localStorage.removeItem(
    SESSION_KEY
  )
}



/*
|--------------------------------------------------------------------------
| ROLE HELPERS
|--------------------------------------------------------------------------
*/

export function isDriverSession() {

  return (
    getCurrentSession().role ===
    "driver"
  )
}

export function isFleetManagerSession() {

  return (
    getCurrentSession().role ===
    "fleet_manager"
  )
}

export function isIncidentManagerSession() {

  return (
    getCurrentSession().role ===
    "incident_manager"
  )
}



/*
|--------------------------------------------------------------------------
| GET CURRENT DRIVER
|--------------------------------------------------------------------------
|
| Útil para dashboard conductor.
|
*/

export function getCurrentDriver() {

  const session =
    getCurrentSession()

  if (
    session.role !== "driver"
  ) {

    return null
  }


  const drivers =
    getData("conductores")


  return drivers.find(
    (driver: any) =>
      driver.id === session.userId
  )
}