import * as authService
from "../services/auth.service.js"



export async function login(
  req,
  res
) {

  try {

    const {
      email,
      password
    } = req.body


    const result =
      await authService.login(
        email,
        password
      )


    return res.json(result)

  } catch (error) {

    return res.status(401).json({

      message:
        error.message
    })
  }
}

export async function me(
  req,
  res
) {

  return res.json(
    req.user
  )
}