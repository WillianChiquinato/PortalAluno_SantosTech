import { useNuxtApp } from '#app'

function getStorage(): Storage | null {
  if (!import.meta.client) {
    return null
  }

  return window.localStorage
}

export function getToken() {
  return getStorage()?.getItem('token') ?? null
}

export function setToken(token: string) {
  getStorage()?.setItem('token', token)
}

export function verifyToken(): boolean {
  const token = getToken()

  if (!token) return false

  return !isTokenExpired(token)
}

export function removeToken() {
  getStorage()?.removeItem('token')
}

export function clearAuth() {
  removeToken()
  getStorage()?.removeItem('loggedUser')
}

export function getLoggedUser() {
  if (!verifyToken()) {
    clearAuth()
    return null
  }

  const user = getStorage()?.getItem('loggedUser')

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    clearAuth()
    return null
  }
}

export function setLoggedUser(user: any) {
  getStorage()?.setItem('loggedUser', JSON.stringify(user))
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export async function checkAuth() {
  if (!import.meta.client) {
    return false
  }

  const token = getToken()
  if (!token) return false

  try {
    const { $httpClient } = useNuxtApp()
    await $httpClient.auth.Logged()
    return true
  } catch {
    clearAuth()
    return false
  }
}
