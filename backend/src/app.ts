import express from "express"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API funcionando 🚀")
})

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000")
})