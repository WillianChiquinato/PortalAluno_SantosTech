import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'
import { clearAuth } from '~/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

export const fetchInstance = $fetch.create({
  onRequest({ options }) {
    const { public: { apiBaseUrl } } = useRuntimeConfig()
    const headers = new Headers(options.headers)

    options.baseURL = apiBaseUrl
    options.credentials = 'include'
    headers.set('Content-Type', 'application/json')

    options.headers = headers
  },

  onResponse({ response }) {
    return response._data
  },

  onResponseError({ response }) {
    if (response.status === 401) {
      clearAuth()

      if (import.meta.client) {
        const redirectUrl = window.location.href
        window.location.replace(`${AUTH_ORIGIN}?redirect=${encodeURIComponent(redirectUrl)}`)
      }
    }

    console.error('API Error:', response)
    throw response._data ?? response
  },
})
