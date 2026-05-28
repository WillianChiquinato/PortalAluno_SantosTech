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
      // Não redirecionar aqui — o middleware de rota já trata o redirect para
      // auth quando a sessão está inválida. Redirecionar no 401 cria loop:
      // API 401 → auth (usuário já autenticado lá) → portal → API 401 → auth → ...
    }

    console.error('API Error:', response)
    throw response._data ?? response
  },
})
