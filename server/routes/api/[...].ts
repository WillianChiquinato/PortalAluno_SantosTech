export default defineEventHandler(async (event) => {
  const internalApiUrl = process.env.NUXT_INTERNAL_API_URL?.replace(/\/$/, '')

  if (!internalApiUrl) {
    throw createError({ statusCode: 502, statusMessage: 'NUXT_INTERNAL_API_URL not configured' })
  }

  return proxyRequest(event, `${internalApiUrl}${event.path}`)
})
