import { checkAuth, verifyToken } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/auth/callback') {
    return
  }

  // SSR: não verifica auth — o layout exibe overlay de loading até o client confirmar
  // Tentar chamar a API no SSR causa loop quando apiBaseUrl aponta para URL interna
  if (!process.client) {
    return
  }

  const hasValidSession = verifyToken() || (await checkAuth())

  if (!hasValidSession) {
    const redirectUrl = window.location.origin + to.fullPath
    return navigateTo(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`, { external: true })
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
