import { checkAuth, verifyToken } from '@/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) {
    return
  }

  const publicRoutes = new Set([
    '/',
    '/auth/callback',
  ])
  const isPublicRoute = publicRoutes.has(to.path)
  const hasValidSession = verifyToken() || (await checkAuth())

  if (!hasValidSession && !isPublicRoute) {
    return navigateTo({
      path: '/',
      query: { auth: 'required' },
    })
  }

  if (hasValidSession && isPublicRoute) {
    return navigateTo('/dashboard')
  }
})
