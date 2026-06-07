import jwt from "jsonwebtoken"



export function authMiddleware(
  req,
  res,
  next
) {

  try {

    const authHeader =
      req.headers.authorization


    if (!authHeader) {

      return res.status(401).json({
        message:
          "Token requerido"
      })
    }


    const token =
      authHeader.replace(
        "Bearer ",
        ""
      )


    const payload =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )


    req.user = payload

    next()

  } catch {

    return res.status(401).json({

      message:
        "Token inválido"
    })
  }
}

