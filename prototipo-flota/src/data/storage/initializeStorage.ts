import asignaciones
from "../seed/asignaciones.json"

import conductores
from "../seed/conductores.json"

import incidencias
from "../seed/incidencias.json"

import rutas
from "../seed/rutas.json"

import solicitudes
from "../seed/solicitudes.json"

import sucursales
from "../seed/sucursales.json"

import trabajos
from "../seed/trabajos.json"

import vehiculos
from "../seed/vehiculos.json"

import {
  saveData
} from "./localStorage"



export function initializeStorage() {

  if (
    !localStorage.getItem("initialized")
  ) {

    saveData(
      "asignaciones",
      asignaciones
    )

    saveData(
      "conductores",
      conductores
    )

    saveData(
      "incidencias",
      incidencias
    )

    saveData(
      "rutas",
      rutas
    )

    saveData(
      "solicitudes",
      solicitudes
    )

    saveData(
      "sucursales",
      sucursales
    )

    saveData(
      "trabajos",
      trabajos
    )

    saveData(
      "vehiculos",
      vehiculos
    )

    localStorage.setItem(
      "initialized",
      "true"
    )
  }
}