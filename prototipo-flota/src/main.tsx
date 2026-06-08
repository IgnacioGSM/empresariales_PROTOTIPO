import React from "react"
import ReactDOM from "react-dom/client"

import {
  RouterProvider
} from "react-router-dom"

import { router } from "./router"

import { initializeStorage }
from "./data/storage/initializeStorage"

import { AuthProvider } from "./contexts/authContext"

import "./styles/global.css"


initializeStorage()

const rootElement = document.getElementById("root") as HTMLElement
ReactDOM.createRoot(
  rootElement
).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)