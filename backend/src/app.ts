import express from "express"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"

// routes
import assignmentRoutes from "./routes/assignmentRoutes"
import workRoutes from "./routes/workRoutes"
import requestRoutes from "./routes/requestRoutes"
import routeRoutes from "./routes/routeRoutes"
// (luego agregarás requestRoutes, etc)

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)

// test route
app.get("/", (req, res) => {
  res.send("API funcionando 🚀")
})

// routes
app.use("/requests", requestRoutes)
app.use("/works", workRoutes)
app.use("/assignments", assignmentRoutes)
app.use("/routes", routeRoutes)

export default app