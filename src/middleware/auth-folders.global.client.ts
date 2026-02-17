export default defineNuxtRouteMiddleware((to) => {
  const publicRoutes = new Set(['/', '/login'])

  if (publicRoutes.has(to.path)) {
    return
  }

  const token = localStorage.getItem('token')

  if (!token) {
    return navigateTo('/')
  }

  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) {
      localStorage.removeItem('token')
      localStorage.removeItem('loggedUser')
      return navigateTo('/')
    }

    const payload = JSON.parse(atob(payloadBase64))
    const isExpired = payload.exp * 1000 < Date.now()

    if (isExpired) {
      localStorage.removeItem('token')
      localStorage.removeItem('loggedUser')
      return navigateTo('/')
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedUser')
    return navigateTo('/')
  }
})
