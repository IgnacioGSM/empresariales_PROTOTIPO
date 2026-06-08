import express from "express"

// routes
import assignmentRoutes from "./routes/assignmentRoutes"
// (luego agregarás requestRoutes, etc)

const app = express()

// middlewares
app.use(express.json())

// test route
app.get("/", (req, res) => {
  res.send("API funcionando 🚀")
})

// routes
app.use("/assignments", assignmentRoutes)

export default app