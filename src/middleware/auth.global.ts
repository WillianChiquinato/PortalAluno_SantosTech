import { checkAuth, verifyToken } from '@/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) {
    return
  }

  const publicRoutes = new Set([
    '/auth/callback',
  ])
  const isPublicRoute = publicRoutes.has(to.path)
  const hasValidSession = verifyToken() || (await checkAuth())

  if (!hasValidSession && !isPublicRoute) {
    const redirectUrl = window.location.origin + to.fullPath
    window.location.replace(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`)
    return
  }

  if (hasValidSession && (isPublicRoute || to.path === '/')) {
    return navigateTo('/dashboard')
  }
})
