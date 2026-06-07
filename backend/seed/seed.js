import prisma from "../src/prisma.ts"
import bcrypt from "bcrypt"

async function main() {

  const passwordHash =
    await bcrypt.hash(
      "123456",
      10
    )

  const sucursal =
    await prisma.sucursal.create({
      data: {
        nombre: "Sucursal Central",
        direccion:
          "Av. Principal 123"
      }
    })

  const vehiculoActivo =
    await prisma.vehiculo.create({
      data: {
        patente: "ABC123",

        capacidad: 5000,

        estado: "EnRuta",

        documentacionVigente: true,
        mantencionVigente: true,

        sucursalId:
          sucursal.id
      }
    })


  const vehiculoDisponible =
    await prisma.vehiculo.create({
      data: {
        patente: "XYZ789",

        capacidad: 8000,

        estado: "Disponible",

        documentacionVigente: true,
        mantencionVigente: true,

        sucursalId:
          sucursal.id
      }
    })

  const conductorActivo =
    await prisma.conductor.create({
      data: {
        nombre:
          "Juan Pérez",

        estado:
          "EnRuta",

        documentacionVigente: true,

        sucursalId:
          sucursal.id
      }
    })


  const conductorDisponible =
    await prisma.conductor.create({
      data: {
        nombre:
          "María González",

        estado:
          "Disponible",

        documentacionVigente: true,

        sucursalId:
          sucursal.id
      }
    })

  await prisma.usuario.createMany({
    data: [

      {
        nombre:
          "Administrador",

        email:
          "admin@test.cl",

        passwordHash,

        rol:
          "ADMIN",

        sucursalId:
          sucursal.id
      },

      {
        nombre:
          "Gestor de Flota",

        email:
          "fleet@test.cl",

        passwordHash,

        rol:
          "FLEET_MANAGER",

        sucursalId:
          sucursal.id
      },

      {
        nombre:
          "Gestor de Incidencias",

        email:
          "incident@test.cl",

        passwordHash,

        rol:
          "INCIDENT_MANAGER",

        sucursalId:
          sucursal.id
      },

      {
        nombre:
          "Encargado Solicitudes",

        email:
          "request@test.cl",

        passwordHash,

        rol:
          "REQUEST_MANAGER",

        sucursalId:
          sucursal.id
      }
    ]
  })

  await prisma.usuario.create({
    data: {
      nombre:
        "Juan Pérez",

      email:
        "driver1@test.cl",

      passwordHash,

      rol:
        "DRIVER",

      sucursalId:
        sucursal.id,

      conductorId:
        conductorActivo.id
    }
  })


  await prisma.usuario.create({
    data: {
      nombre:
        "María González",

      email:
        "driver2@test.cl",

      passwordHash,

      rol:
        "DRIVER",

      sucursalId:
        sucursal.id,

      conductorId:
        conductorDisponible.id
    }
  })

  const solicitudAprobada =
    await prisma.solicitud.create({
      data: {
        cliente:
          "Empresa Minera Norte",

        destino:
          "Antofagasta",

        cargaRequerida:
          5000,

        fechaLimite:
          new Date(
            Date.now()
            + 3 * 24 * 60 * 60 * 1000
          ),

        estado:
          "Aprobada"
      }
    })


  await prisma.solicitud.create({
    data: {
      cliente:
        "Constructora Sur",

      destino:
        "Valdivia",

      cargaRequerida:
        3000,

      fechaLimite:
        new Date(
          Date.now()
          + 5 * 24 * 60 * 60 * 1000
        ),

      estado:
        "Pendiente"
      }
    })

  const trabajo =
    await prisma.trabajo.create({
      data: {

        solicitudId:
          solicitudAprobada.id,

        estadoOperativo:
          "EnProceso",

        resultado:
          null,

        cargaTotal:
          5000,

        cargaEntregada:
          0
      }
    })

  const asignacion =
    await prisma.asignacion.create({
      data: {

        trabajoId:
          trabajo.id,

        vehiculoId:
          vehiculoActivo.id,

        conductorId:
          conductorActivo.id,

        estadoOperativo:
          "Activa",

        resultado:
          null
      }
    })
  
  const ruta =
    await prisma.ruta.create({
      data: {

        asignacionId:
          asignacion.id,

        estado:
          "EnRuta"
      }
    })
  
  await prisma.rutaEvento.create({
    data: {

      rutaId:
        ruta.id,

      tipo:
        "INICIO_RUTA",

      descripcion:
        "Ruta iniciada"
    }
  })

  const incidencia =
    await prisma.incidencia.create({
      data: {

        rutaId:
          ruta.id,

        estado:
          "Abierta",

        tipo:
          "Vehiculo",

        descripcion:
          "Falla mecánica menor",

        gravedad:
          "Media",

        danoEstimado:
          150000,

        reportadoPor:
          conductorActivo.nombre
      }
    })
  
  await prisma.incidenciaAccion.create({
    data: {

      incidenciaId:
        incidencia.id,

      tipo:
        "NOTIFICACION",

      descripcion:
        "Gestor informado",

      realizadaPor:
        "Sistema"
    }
  })

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {

    console.error(error)

    await prisma.$disconnect()

    process.exit(1)
  })