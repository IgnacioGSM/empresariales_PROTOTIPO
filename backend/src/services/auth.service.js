import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import  prisma  from "../prisma.ts"



export async function login(email, password) {

  const user =
    await prisma.usuario.findUnique({
      where: {
        email
      }
    })


  if (!user) {
    throw new Error(
      "Credenciales inválidas"
    )
  }


  const validPassword =
    await bcrypt.compare(
      password,
      user.passwordHash
    )


  if (!validPassword) {
    throw new Error(
      "Credenciales inválidas"
    )
  }


  const token =
    jwt.sign(
      {
        userId: user.id,
        rol: user.rol,
        sucursalId: user.sucursalId,
        conductorId: user.conductorId
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "24h"
      }
    )


  return {

    token,

    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      sucursalId: user.sucursalId,
      conductorId: user.conductorId
    }
  }
}