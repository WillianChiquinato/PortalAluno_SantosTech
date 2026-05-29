import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'
import { clearAuth } from '~/composables/useAuth'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

// ─── Refresh singleton ───────────────────────────────────────────────────────
let _refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  try {
    // Usa fetch nativo para evitar loop no interceptor do fetchInstance
    const res = await fetch('/auth-refresh', { method: 'POST', credentials: 'include' })
    return res.ok
  } catch {
    return false
  }
}

function scheduleRefresh(): Promise<boolean> {
  if (!_refreshPromise) {
    _refreshPromise = tryRefresh().finally(() => { _refreshPromise = null })
  }
  return _refreshPromise
}
// ─────────────────────────────────────────────────────────────────────────────

const _base = $fetch.create({
  onRequest({ options }) {
    const { public: { apiBaseUrl } } = useRuntimeConfig()
    const headers = new Headers(options.headers)

    options.baseURL = apiBaseUrl || '/'
    options.credentials = 'include'
    headers.set('Content-Type', 'application/json')

    options.headers = headers
  },

  onResponse({ response }) {
    return response._data
  },

  onResponseError({ response }) {
    console.error('API Error:', response)
    throw response._data ?? response
  },
})

// Wrapper com auto-refresh em 401 + retry automático
export const fetchInstance: typeof _base = async function fetchWithRefresh(
  url: string,
  opts: any = {},
): Promise<any> {
  try {
    return await _base(url, opts)
  } catch (err: any) {
    const status = err?.status ?? err?.statusCode ?? err?.response?.status
    if (status === 401 && !opts._refreshed && import.meta.client) {
      const ok = await scheduleRefresh()
      if (ok) {
        return _base(url, { ...opts, _refreshed: true })
      }
      clearAuth()
    } else if (status === 401) {
      clearAuth()
    }
    throw err
  }
} as typeof _base
