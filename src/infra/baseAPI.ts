import { navigateTo } from '#app'
import { $fetch } from 'ofetch'
import { clearAuth, getToken, verifyToken } from '~/composables/useAuth'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const fetchInstance = $fetch.create({
  baseURL,

  onRequest({ options }) {
    const headers = new Headers(options.headers)

    headers.set('Content-Type', 'application/json')

    const token = getToken()
    if (token && verifyToken()) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    options.headers = headers
  },

  onResponse({ response }) {
    return response._data
  },

  onResponseError({ response }) {
    if (response.status === 401) {
      clearAuth()

      navigateTo('/')
    }

    console.error('API Error:', response)
    throw response._data ?? response
  },
})
