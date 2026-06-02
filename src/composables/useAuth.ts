import { useNuxtApp, useState } from '#app'
import type { IAuth } from '~/infra/interfaces/services/auth'
import { useUserStore } from '~/infra/store/userStore'
const STUDENT_VIEW_RETURN_URL_KEY = 'student-view:return-url'

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

export function setStudentViewReturnUrl(url: string | null) {
  if (!import.meta.client) {
    return
  }

  if (!url || !url.trim()) {
    window.sessionStorage.removeItem(STUDENT_VIEW_RETURN_URL_KEY)
    return
  }

  window.sessionStorage.setItem(STUDENT_VIEW_RETURN_URL_KEY, url)
}

export function getStudentViewReturnUrl() {
  if (!import.meta.client) {
    return null
  }

  const value = window.sessionStorage.getItem(STUDENT_VIEW_RETURN_URL_KEY)
  return value && value.trim().length > 0 ? value : null
}

export function clearAuth() {
  authUserState().value = null
  authInitializedState().value = false
  authPendingState().value = null
  useUserStore().clearUserId()
  setStudentViewReturnUrl(null)
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

      if (response?.result) {
        setLoggedUser(response.result)
        return true
      }
      clearAuth()
      return false
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
    // Remove o token no auth server (auth.santos-tech.com) — limpa o cookie de SSO
    if (import.meta.client) {
      await fetch('/portal-utils/auth-logout', { method: 'POST', credentials: 'include' })
    }
    // Encerra também a sessão local da API do portal
    await $httpClient.auth.Logout()
  } catch (error) {
    console.error('Erro ao encerrar sessão no logout:', error)
  } finally {
    clearAuth()
    if (import.meta.client) {
      window.location.replace('https://auth.santos-tech.com')
    }
  }
}
