import express from "express"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"

// routes
import assignmentRoutes from "./routes/assignmentRoutes.ts"
import requestRoutes from "./routes/requestRoutes.ts"


const app = express()

app.use(cors())
app.use(express.json())

// test route
app.get("/", (req, res) => {
  res.send("API funcionando 🚀")
})

// routes
app.use("/api/auth", authRoutes)
app.use("/api/assignments", assignmentRoutes)
app.use("/api/requests", requestRoutes)

export default app