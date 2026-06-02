import { checkAuth, verifyToken } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

// Rotas liberadas mesmo sem uma turma selecionada (o resolver vive aqui)
const COURSE_OPTIONAL_PATHS = ['/user-courses']

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/auth/callback' || to.path === '/dev-login') {
    return
  }

  // SSR: não verifica auth — o layout exibe overlay de loading até o client confirmar
  // Tentar chamar a API no SSR causa loop quando apiBaseUrl aponta para URL interna
  if (!process.client) {
    return
  }

  const hasValidSession = verifyToken() || (await checkAuth())

  if (!hasValidSession) {
    const config = useRuntimeConfig()
    if (config.public.devAuth) {
      return navigateTo('/dev-login')
    }
    const redirectUrl = window.location.origin + to.fullPath
    return navigateTo(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`, { external: true })
  }

  // Gate de turma: antes de liberar páginas internas, exige uma turma selecionada
  // nesta sessão. Checagem barata (sessionStorage) — o fetch das turmas acontece
  // no resolver (/user-courses), que decide auto-selecionar (1 turma) ou exibir o seletor (>1).
  const hasSelectedCourse = Boolean(sessionStorage.getItem('enrollmentId'))
  if (!hasSelectedCourse && !COURSE_OPTIONAL_PATHS.includes(to.path)) {
    return navigateTo('/user-courses')
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
