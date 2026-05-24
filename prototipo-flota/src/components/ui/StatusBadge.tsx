function StatusBadge({ status }: { status: string }) {

  function getClasses() {

    switch(status) {

      case "Disponible":
      case "Completado":
      case "Completada":

        return `
          bg-green-100
          text-green-800
        `

      case "Asignado":
      case "Pendiente":
      case "Confirmada":

        return `
          bg-yellow-100
          text-yellow-800
        `

      case "En ruta":
      case "Activa":

        return `
          bg-blue-100
          text-blue-800
        `

      case "Retornando":

        return `
          bg-cyan-100
          text-cyan-800
        `

      case "Averiado":
      case "Abortada":
      case "Fallado":

        return `
          bg-red-100
          text-red-800
        `

      default:

        return `
          bg-slate-200
          text-slate-800
        `
    }
  }


  return (

    <span
      className={`
        inline-block
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
        ${getClasses()}
      `}
    >
      {status}
    </span>
  )
}

export default StatusBadge