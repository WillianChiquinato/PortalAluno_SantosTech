import { checkAuth, verifyToken } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export default defineNuxtRouteMiddleware(async (to) => {
  // O callback gerencia seu próprio fluxo — não interferir
  if (to.path === '/auth/callback') {
    return
  }

  const hasValidSession = verifyToken() || (await checkAuth())

  if (!hasValidSession) {
    // Usa useRequestURL() no SSR e window no client para obter a origin correta
    const origin = process.client
      ? window.location.origin
      : useRequestURL().origin
    const redirectUrl = origin + to.fullPath
    // navigateTo com external:true funciona em SSR e client — sem flash de conteúdo
    return navigateTo(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`, { external: true })
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
