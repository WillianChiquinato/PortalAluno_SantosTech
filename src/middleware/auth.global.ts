import { verifyToken } from '@/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) {
    return
  }

  const isPublicRoute = to.path === '/'
  const hasValidToken = verifyToken()

  if (!hasValidToken && !isPublicRoute) {
    return navigateTo({
      path: '/',
      query: { auth: 'required' },
    })
  }

  if (hasValidToken && isPublicRoute) {
    return navigateTo('/dashboard')
  }
})
