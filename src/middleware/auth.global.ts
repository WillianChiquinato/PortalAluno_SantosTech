import { checkAuth, verifyToken } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/auth/callback') {
    return
  }

  let hasValidSession = false

  if (process.client) {
    hasValidSession = verifyToken() || (await checkAuth())
  } else {
    // SSR: verifica presença do cookie access_token — não chama a API para evitar
    // problemas de URL relativa no contexto Node.js (apiBaseUrl pode ser vazio no SSR)
    const { cookie } = useRequestHeaders(['cookie'])
    hasValidSession = Boolean(
      cookie && cookie.split(';').some((c) => c.trim().startsWith('access_token=')),
    )
  }

  if (!hasValidSession) {
    const origin = process.client ? window.location.origin : useRequestURL().origin
    const redirectUrl = origin + to.fullPath
    return navigateTo(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`, { external: true })
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
