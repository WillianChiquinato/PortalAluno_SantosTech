import { checkAuth, verifyToken } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) {
    return
  }

  // O callback gerencia seu próprio fluxo de autenticação — não interferir aqui
  // evita que o middleware redirecione para /dashboard antes do onMounted do callback rodar
  // e evita chamar checkAuth() duas vezes no mesmo carregamento
  if (to.path === '/auth/callback') {
    return
  }

  const hasValidSession = verifyToken() || (await checkAuth())

  if (!hasValidSession) {
    const redirectUrl = window.location.origin + to.fullPath
    window.location.replace(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`)
    return
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
