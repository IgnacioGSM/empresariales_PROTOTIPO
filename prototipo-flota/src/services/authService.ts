import { api }
from "../api/apiClient"

export async function login(
  email,
  password
) {

  const response =
    await api.post(
      "/auth/login",
      {
        email,
        password
      }
    )

  return response.data
}

export async function getMe() {

  const response =
    await api.get(
      "/auth/me"
    )

  return response.data
}

export function saveToken(
  token
) {

  localStorage.setItem(
    "token",
    token
  )
}

export function getToken() {

  return localStorage.getItem(
    "token"
  )
}

export function logout() {

  localStorage.removeItem(
    "token"
  )
}

export function isAuthenticated() {

  return !!getToken()
}