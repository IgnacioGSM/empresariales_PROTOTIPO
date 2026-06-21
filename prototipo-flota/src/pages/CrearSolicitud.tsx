import { useState } from "react"
import { createRequest } from "../services/requestService_OLD"
import Navbar from "../components/ui/Navbar"

type FormState = {
  cliente: string
  destino: string
  cargaRequerida: string
  fechaLimite: string
}

export default function CrearSolicitud() {

  const [form, setForm] = useState<FormState>({
    cliente: "",
    destino: "",
    cargaRequerida: "",
    fechaLimite: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      if (
        !form.cliente ||
        !form.destino ||
        !form.cargaRequerida ||
        !form.fechaLimite
      ) {
        throw new Error("Todos los campos son obligatorios")
      }

      const carga = Number(form.cargaRequerida)

      if (isNaN(carga) || carga <= 0) {
        throw new Error("La carga debe ser un número válido")
      }

      createRequest({
        cliente: form.cliente,
        destino: form.destino,
        capacidadCargaNecesaria: carga,
        fechaLimiteEntrega: form.fechaLimite
      })

      setForm({
        cliente: "",
        destino: "",
        cargaRequerida: "",
        fechaLimite: ""
      })

      alert("Solicitud creada correctamente")

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="p-6 bg-bg min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold text-primary mb-6">
        Crear Solicitud de Trabajo
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Cliente
          </label>
          <input
            type="text"
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Destino
          </label>
          <input
            type="text"
            name="destino"
            value={form.destino}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Carga requerida (kg)
          </label>
          <input
            type="number"
            name="cargaRequerida"
            value={form.cargaRequerida}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha límite
          </label>
          <input
            type="date"
            name="fechaLimite"
            value={form.fechaLimite}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:opacity-90 transition"
        >
          {loading ? "Creando..." : "Crear Solicitud"}
        </button>
      </form>
    </div>
  )
}