import express from "express"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"

// routes
import assignmentRoutes from "./routes/assignmentRoutes"
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
app.use("/assignments", assignmentRoutes)

export default app