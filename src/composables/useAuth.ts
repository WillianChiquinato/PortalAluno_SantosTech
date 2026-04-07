import { useNuxtApp, useState } from '#app'
import type { IAuth } from '~/infra/interfaces/services/auth'
import { useUserStore } from '~/infra/store/userStore'

function authUserState() {
  return useState<IAuth | null>('auth-user', () => null)
}

function authInitializedState() {
  return useState<boolean>('auth-initialized', () => false)
}

function authPendingState() {
  return useState<Promise<boolean> | null>('auth-pending', () => null)
}

export function getToken() {
  return null
}

export function setToken(_token: string) {}

export function verifyToken(): boolean {
  return Boolean(authUserState().value)
}

export function removeToken() {}

export function clearAuth() {
  authUserState().value = null
  authInitializedState().value = false
  authPendingState().value = null
  useUserStore().clearUserId()
}

export function getLoggedUser() {
  return authUserState().value
}

export function setLoggedUser(user: IAuth | null) {
  authUserState().value = user
  authInitializedState().value = true
}

async function fetchSession(force = false) {
  if (!import.meta.client) {
    return false
  }

  const initialized = authInitializedState()
  const pending = authPendingState()

  if (!force && initialized.value) {
    return verifyToken()
  }

  if (!force && pending.value) {
    return await pending.value
  }

  const sessionPromise = (async () => {
    try {
      const { $httpClient } = useNuxtApp()
      const response = await $httpClient.auth.Session()

      setLoggedUser(response.result)
      return true
    } catch {
      clearAuth()
      return false
    } finally {
      authInitializedState().value = true
      authPendingState().value = null
    }
  })()

  pending.value = sessionPromise
  return await sessionPromise
}

export async function checkAuth(force = false) {
  return await fetchSession(force)
}

export async function logout() {
  const { $httpClient } = useNuxtApp()

  try {
    await $httpClient.auth.Logout()
  } finally {
    clearAuth()
  }
}
