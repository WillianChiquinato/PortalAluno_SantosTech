import { checkAuth, verifyToken, setLoggedUser } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export default defineNuxtRouteMiddleware(async (to) => {
  // O callback gerencia seu próprio fluxo — não interferir
  if (to.path === '/auth/callback') {
    return
  }

  let hasValidSession = false

  if (process.client) {
    // Client: usa estado cacheado + API se necessário
    hasValidSession = verifyToken() || (await checkAuth())
  } else {
    // SSR: chama a API diretamente passando os cookies do browser via header
    // useRequestHeaders só funciona no contexto do middleware, não dentro de $fetch.create
    try {
      const { $httpClient } = useNuxtApp()
      const { cookie } = useRequestHeaders(['cookie'])
      const response = await $httpClient.auth.Session({
        headers: cookie ? { cookie } : {},
      })
      if (response?.result) {
        setLoggedUser(response.result)
        hasValidSession = true
      }
    } catch {
      hasValidSession = false
    }
  }

  if (!hasValidSession) {
    const origin = process.client
      ? window.location.origin
      : useRequestURL().origin
    const redirectUrl = origin + to.fullPath
    return navigateTo(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`, { external: true })
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
